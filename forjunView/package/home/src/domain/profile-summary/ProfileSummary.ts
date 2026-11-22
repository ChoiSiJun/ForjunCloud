export interface ProfileSummaryDraft {
  headline: string;
  strengths: { title: string; evidence: string }[];
  workingStyle: string;
  representativeExperience: string;
}

export interface ProfileSummary extends ProfileSummaryDraft {
  published: boolean;
}

export const emptySummary: ProfileSummary = {
  headline: '',
  strengths: [],
  workingStyle: '',
  representativeExperience: '',
  published: false,
};

function readText(value: unknown, maxLength: number) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new Error('Invalid summary field');
  }
  return value.trim();
}

export function readSummaryDraft(value: unknown): ProfileSummaryDraft {
  if (!value || typeof value !== 'object' || !('strengths' in value) || !Array.isArray(value.strengths)
    || value.strengths.length < 1 || value.strengths.length > 3
    || !('headline' in value) || !('workingStyle' in value) || !('representativeExperience' in value)) {
    throw new Error('Invalid summary');
  }

  return {
    headline: readText(value.headline, 200),
    strengths: value.strengths.map((item: unknown) => {
      if (!item || typeof item !== 'object' || !('title' in item) || !('evidence' in item)) {
        throw new Error('Invalid strength');
      }
      return { title: readText(item.title, 100), evidence: readText(item.evidence, 600) };
    }),
    workingStyle: readText(value.workingStyle, 2000),
    representativeExperience: readText(value.representativeExperience, 2000),
  };
}
