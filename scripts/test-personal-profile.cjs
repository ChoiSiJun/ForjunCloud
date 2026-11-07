const fs = require('fs');
const vm = require('vm');
const ts = require('typescript');
const assert = require('node:assert/strict');
const source = fs.readFileSync('package/home/src/domain/personal/hooks/usePersonal.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
class AxiosError extends Error { constructor(status) { super('failed'); if (status) this.response = { status }; } }
async function scenario({ existing = 'old', file = false, uploadFails = false, saveError, observed, lookupFails = false, concurrent = false } = {}) {
  let form, stateIndex = 0;
  const calls = { uploads: 0, saves: [], deletes: [], errors: [] };
  const data = { name: 'Test', job: 'Engineer', profileImageId: existing, profileImageUrl: existing ? '/image/old' : null };
  const modules = {
    react: { useState: initial => { const index = stateIndex++; return [index === 1 && file ? {} : initial, () => {}]; }, useRef: value => ({ current: value }), useEffect: () => {}, useCallback: fn => fn, useMemo: fn => fn() },
    axios: { AxiosError },
    'react-query': { useQueryClient: () => ({ invalidateQueries() {}, setQueryData() {} }) },
    formik: { useFormik: config => { form = { values: config.initialValues, submit: () => config.onSubmit(form.values), setFieldValue: async (key, value) => { form.values = { ...form.values, [key]: value }; } }; return form; } },
    yup: { object: () => {}, string: () => ({ required() {} }) },
    'react-toastify': { toast: { success() {}, error: message => calls.errors.push(message) } },
    '@domain/personal/api/usePersonalQuery': { default: () => ({ data }), fetchPersonal: async () => { if (lookupFails) throw Error(); return { ...data, profileImageId: observed }; } },
    '@domain/personal/api/usePersonalSaveMutation': { default: () => ({ mutateAsync: async body => { calls.saves.push(body); if (saveError) throw saveError; } }) },
    '@domain/upload/api/useFileUploadMutation': { default: () => ({ mutateAsync: async () => { calls.uploads++; if (uploadFails) throw new AxiosError(400); return { fileId: 'new', url: 'profile/new.png' }; } }) },
    '@domain/upload/api/useFileDeleteMutation': { default: () => ({ mutateAsync: async id => calls.deletes.push(id) }) },
  };
  const sandbox = { exports: {}, require: name => { assert.ok(modules[name], name); return modules[name]; } };
  vm.runInNewContext(code, sandbox);
  sandbox.exports.usePersonal();
  if (concurrent) await Promise.all([form.submit(), form.submit()]); else await form.submit();
  return { calls, form };
}
(async () => {
  for (const existing of [null, 'old']) {
    const { calls } = await scenario({ existing });
    assert.equal(calls.saves[0].profile_image_id, existing);
    assert.equal(calls.uploads, 0);
    assert.ok(!('profile_image_url' in calls.saves[0]));
    assert.ok(!('profileImageUrl' in calls.saves[0]));
  }
  for (const existing of [null, 'old']) {
    const { calls, form } = await scenario({ existing, file: true });
    assert.equal(calls.saves[0].profile_image_id, 'new');
    assert.equal(form.values.profileImageId, 'new');
  }
  const failedUpload = await scenario({ file: true, uploadFails: true });
  assert.equal(failedUpload.calls.saves.length, 0);
  assert.equal(failedUpload.form.values.profileImageId, 'old');
  const failedSave = await scenario({ file: true, saveError: new AxiosError(404) });
  assert.equal(failedSave.calls.deletes.join(), 'new');
  assert.equal(failedSave.form.values.profileImageId, 'old');
  await failedSave.form.submit();
  assert.equal(failedSave.calls.uploads, 2);
  const saved = await scenario({ file: true, saveError: new AxiosError(), observed: 'new' });
  assert.equal(saved.calls.deletes.length, 0);
  const unsaved = await scenario({ file: true, saveError: new AxiosError(), observed: 'old' });
  assert.equal(unsaved.calls.deletes.join(), 'new');
  const unknown = await scenario({ file: true, saveError: new AxiosError(), lookupFails: true });
  assert.equal(unknown.calls.deletes.length, 0);
  assert.equal(unknown.calls.errors.length, 1);
  const duplicate = await scenario({ file: true, concurrent: true });
  assert.equal(duplicate.calls.uploads, 1);
  assert.equal(duplicate.calls.saves.length, 1);
  console.log('PASS: create, unchanged, replacement, upload failure, cleanup/retry, uncertain outcome, duplicate submit');
})().catch(error => { console.error(error); process.exitCode = 1; });
