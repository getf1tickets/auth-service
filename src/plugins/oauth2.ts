/* eslint-disable @typescript-eslint/no-unused-vars */
import fp from 'fastify-plugin';
import to from 'await-to-js';
import { User, sha256 } from '@getf1tickets/sdk';
import { FastifyRequest, FastifyReply } from 'fastify';
import { DateTime } from 'luxon';
import { OAuth2Client } from '@/models/oauth2/client';
import { OAuth2ClientGrant, OAuth2ClientGrants } from '@/models/oauth2/client/grant';
import { OAuth2ClientRedirectUri } from '@/models/oauth2/client/redirect';
import { compareHash } from '@/utils/string';
import { createAccessToken, createRefreshToken } from '@/utils/token';
import { OAuth2Token, OAuth2TokenCreationAttributes } from '@/models/oauth2/token';

declare module 'fastify' {
  interface FastifyInstance {
    oauth2: OAuth2
  }
}

export interface OAuth2 {
  token: () => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}

interface OAuth2TokenParameters {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export default fp(async (fastify) => {
  const getClient = async (
    clientId: string,
    clientSecret?: string,
  ): Promise<OAuth2Client> => {
    fastify.log.debug({ name: 'OAuth2' }, 'getClient with clientId: %s, clientSecret: %s', clientId, clientSecret);

    const [err, client] = await to<OAuth2Client | null>(OAuth2Client.findOne({
      where: {
        clientId,
        ...(!!clientSecret && { clientSecret }),
      },
      include: [
        {
          model: OAuth2ClientGrant,
          as: 'grants',
        },
        {
          model: OAuth2ClientRedirectUri,
          as: 'redirectUris',
        },
      ],
    }));

    if (err) {
      fastify.log.error(err);
      throw fastify.httpErrors.internalServerError();
    }

    if (!client) {
      throw fastify.httpErrors.badRequest('Invalid client: client is invalid');
    }

    return client;
  };

  const getUser = async (
    email: string,
    password: string,
  ): Promise<User> => {
    fastify.log.debug({ name: 'OAuth2' }, 'getUser with email: %s, password: %s', email, password);

    const [err, user] = await to<User | null>(User.findOne({
      where: {
        email,
      },
    }));

    if (err) {
      fastify.log.error(err);
      throw fastify.httpErrors.internalServerError();
    }

    if (!user || !compareHash(password, user.hashedPassword)) {
      throw fastify.httpErrors.badRequest('Invalid user: user is invalid');
    }

    return user;
  };

  const generateAccessToken = async (
    client: OAuth2Client,
    user: User,
    scopes: string[],
  ): Promise<string> => {
    fastify.log.debug({ name: 'OAuth2' }, 'generateAccessToken with client: %s, user: %s, scopes: %o', client, user, scopes);
    return createAccessToken(user.id, client.id, scopes);
  };

  const generateRefreshToken = async (
    client: OAuth2Client,
    user: User,
    scopes: string[],
  ): Promise<string> => {
    fastify.log.debug({ name: 'OAuth2' }, 'generateRefreshToken with client: %s, user: %s, scopes: %o', client, user, scopes);
    return createRefreshToken(user.id, client.id, scopes);
  };

  const saveToken = async (
    tokens: OAuth2TokenParameters,
    client: OAuth2Client,
    user: User,
    scopes: string[],
    grant: any,
  ): Promise<void> => {
    fastify.log.debug({ name: 'OAuth2' }, 'saveToken with tokens: %O, scopes: %o, client: %O, user: %O', tokens, client, user);

    const properties: OAuth2TokenCreationAttributes = {
      clientId: client.id,
      userId: user.id,
      hashedAccessToken: sha256(tokens.accessToken),
      accessTokenExpireAt: tokens.accessTokenExpiresAt,
      hashedRefreshToken: sha256(tokens.refreshToken),
      refreshTokenExpireAt: tokens.refreshTokenExpiresAt,
      scopes,
      grant,
    };

    const [err] = await to<OAuth2Token>(OAuth2Token.create(properties));
    if (err) throw err;
  };

  const token = () => async (request: FastifyRequest, reply: FastifyReply) => {
    const {
      client_id: clientId,
      grant_type: grantType,
      email,
      password,
      scope,
    } = request.body as any;

    if (!clientId) {
      throw fastify.httpErrors.badRequest('Missing parameter: client_id');
    }

    if (!grantType) {
      throw fastify.httpErrors.badRequest('Missing parameter: grant_type');
    }

    if (!email) {
      throw fastify.httpErrors.badRequest('Missing parameter: email');
    }

    if (!password) {
      throw fastify.httpErrors.badRequest('Missing parameter: password');
    }

    let scopes: string[] = ['*'];
    if (scope) {
      scopes = `${scope}`.split(',');
    }

    const client = await getClient(clientId);
    if (!client.grants?.find((grant) => grant.type === grantType)) {
      throw fastify.httpErrors.badRequest('Invalid client: grant_type is not allowed');
    }

    if (grantType === OAuth2ClientGrants.PASSWORD) {
      const user = await getUser(email, password);

      const tokens: OAuth2TokenParameters = {
        accessToken: await generateAccessToken(client, user, scopes),
        accessTokenExpiresAt: DateTime.now().plus({ day: 1 }).toJSDate(),
        refreshToken: await generateRefreshToken(client, user, scopes),
        refreshTokenExpiresAt: DateTime.now().plus({ days: 30 }).toJSDate(),
      };

      await saveToken(tokens, client, user, scopes, grantType);

      reply.send({ ...tokens });
    } else {
      throw fastify.httpErrors.badRequest('Invalid client: grant_type is not supported');
    }
  };

  fastify.decorate<OAuth2>('oauth2', {
    token,
  });
}, {
  name: 'oauth2',
});
