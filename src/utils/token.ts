import { UUID } from '@getf1tickets/sdk';
import * as jwt from 'jsonwebtoken';

const { JWT_SECRET = 'secret', JWT_ISSUER } = process.env;

export const DEFAULT_ACCESS_TOKEN_EXPIRES = '30 days';

export interface TokenAttributes {
  identifier: UUID;
  type: string;
  requested: UUID;
  scopes: string[];
  iat: number;
  exp: number;
  iss: string;
  [key: string]: any;
}

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

export const decodeToken = (
  bearer: string,
): Promise<TokenAttributes> => (new Promise<TokenAttributes>((resolve, reject) => {
  jwt.verify(bearer, JWT_SECRET, async (err, data) => {
    if (err || !data || typeof data !== 'object') {
      reject(new Error(err?.message));
    } else {
      resolve(data as any);
    }
  });
}));
