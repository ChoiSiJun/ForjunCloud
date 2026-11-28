import { defineEndpoint } from '@common/type/ApiEndPoint';
import { AiGeneration, AiSettings, ProfileSummary } from '../ProfileSummary';

const url = '/api/v1/profile-summary';
const settingsUrl = `${url}/ai-settings`;

export const PROFILE_SUMMARY_API = {
  own: defineEndpoint<void, ProfileSummary>({ url, method: 'GET' }),
  save: defineEndpoint<ProfileSummary, void>({ url, method: 'PUT' }),
  published: defineEndpoint<string, ProfileSummary>({ url: '/api/v1/public-profile-summary', method: 'GET' }),
  aiSettings: defineEndpoint<void, AiSettings>({ url: settingsUrl, method: 'GET' }),
  saveAiSettings: defineEndpoint<{ baseUrl: string; model: string; apiKey?: string }, AiSettings>({ url: settingsUrl, method: 'PUT' }),
  deleteAiSettings: defineEndpoint<void, void>({ url: settingsUrl, method: 'DELETE' }),
  testAiSettings: defineEndpoint<void, void>({ url: `${settingsUrl}/test`, method: 'POST' }),
  generateAiSummary: defineEndpoint<{ baseUrl: string; prompt: string; targetRole?: string }, AiGeneration>({ url: `${url}/ai-generate`, method: 'POST' }),
};
