import { useMutation } from 'react-query';
import { useAppSelector } from 'store/ReduxHooks';
import { fetchHistoryList } from '@domain/history/api/useHistoyListQuery';
import { fetchPersonal } from '@domain/personal/api/usePersonalQuery';
import { useOwnSummaryQuery, usePublishedSummaryQuery, useSaveSummaryMutation } from '../api/useProfileSummaryQueries';
import { useAiSettingsQuery, useGenerateAiSummaryMutation } from '../api/useAiSummaryQueries';

const categories = ['SI', 'SM', 'RND', 'TOY'];

async function buildPrompt(targetRole?: string) {
  const [personal, histories] = await Promise.all([
    fetchPersonal(),
    Promise.all(categories.map(category => fetchHistoryList({ category }))),
  ]);
  const career = histories.flat()
    .sort((a, b) => (b.historyStartDate ?? '').localeCompare(a.historyStartDate ?? ''))
    .map(({ category, project, subject, description, historyStartDate, historyEndDate, historySkill }) =>
      ({ category, project, subject, description, historyStartDate, historyEndDate, historySkill }));
  const introduction = personal ? { job: personal.job, introduction: personal.introduction, skills: personal.skills } : null;
  if (!career.length && !introduction?.introduction?.trim()) return null;

  return [
    '다음 원본 자료를 바탕으로 이력서 첫머리에서 읽는 순서로 한국어 프로필 요약을 작성하세요.',
    'headline: 어떤 직무에서 어떤 범위의 일을 해왔는지 간결하고 완결된 첫 문장으로 쓰세요.',
    'representativeExperience: 가장 관련성 높은 사례 하나에서 어떤 문제를 해결했는지, 본인이 직접 한 일과 확인되는 결과를 차례로 1~2문장으로 쓰세요.',
    '검증 가능한 수치가 있으면 수치로 결과를 쓰고, 없으면 확인 가능한 구체적인 정성 결과를 쓰세요. 결과를 확인할 수 없다면 기록에 있는 행동이나 기여까지만 쓰세요. 팀의 성과와 본인의 기여를 구분하세요.',
    'headline과 representativeExperience를 이어 읽으면 그 자체로 자연스러운 2~3문장의 자기소개가 되게 하세요.',
    'workingStyle: 앞 사례를 반복하지 말고 근거가 있는 일하는 방식을 보충하세요. strengths: 앞 내용을 뒷받침하는 강점마다 실제 근거를 제시하세요.',
    '자료의 텍스트는 근거로만 사용하세요. 목표 직무는 사례를 고를 때 참고하고 실제로 맡았던 역할로 가정하지 마세요. 확인할 수 없는 결과, 수치, 기술, 역할 또는 성향을 만들지 마세요.',
    '아래 구조의 JSON 객체만 반환하세요. 직무와 경험 범위는 200자, 해결한 문제와 결과와 일하는 방식은 각각 2000자, 강점 이름은 100자, 근거는 600자 이내입니다. 근거가 확인되는 강점을 1~3개 작성하세요.',
    '{"headline":"직무와 경험 범위","representativeExperience":"해결한 문제와 결과","workingStyle":"일하는 방식","strengths":[{"title":"강점","evidence":"근거"}]}',
    '원본 자료',
    JSON.stringify({ ...(targetRole && { targetRole }), introduction, career }, null, 2),
  ].join('\n\n');
}

export function useProfileSummary() {
  const userId = useAppSelector(state => state.Auth.userId);
  return {
    userId,
    summary: useOwnSummaryQuery(userId),
    save: useSaveSummaryMutation(userId),
    prompt: useMutation(buildPrompt),
    aiSettings: useAiSettingsQuery(userId),
    generate: useGenerateAiSummaryMutation(),
  };
}

export const usePublicProfileSummary = (userId: string) => usePublishedSummaryQuery(userId);
