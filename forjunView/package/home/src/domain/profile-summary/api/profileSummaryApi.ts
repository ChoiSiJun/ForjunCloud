import { defineEndpoint } from '@common/type/ApiEndPoint';
import { ProfileSummary } from '../ProfileSummary';

const url = '/api/v1/profile-summary';

export const PROFILE_SUMMARY_API = {
  own: defineEndpoint<void, ProfileSummary>({ url, method: 'GET' }),
  save: defineEndpoint<ProfileSummary, void>({ url, method: 'PUT' }),
  published: defineEndpoint<string, ProfileSummary>({ url: '/api/v1/public-profile-summary', method: 'GET' }),
};
