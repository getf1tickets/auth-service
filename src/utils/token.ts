import * as jwt from 'jsonwebtoken';

const { JWT_SECRET = 'secret', JWT_ISSUER } = process.env;

export const DEFAULT_ACCESS_TOKEN_EXPIRES = '30 days';

const createToken = (
  data: any,
  options: any = {},
): string => jwt.sign(data, JWT_SECRET, {
  issuer: JWT_ISSUER,
  expiresIn: '30days',
  ...options,
});

export const createAccessToken = (
  identifier: string,
  requested: string,
  scopes: string[],
): string => createToken({
  identifier, type: 'access', requested, scopes,
}, { expiresIn: '1days' });

export const createRefreshToken = (
  identifier: string,
  requested: string,
  scopes: string[],
): string => createToken({
  identifier, type: 'access', requested, scopes,
}, { expiresIn: '30days' });
