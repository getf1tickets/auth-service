import OAuth2Client from '@/models/oauth2/client';
import OAuth2Token from '@/models/oauth2/token';

export * from '@/models/oauth2/client';
export default [
  ...OAuth2Client,
  OAuth2Token,
];
