import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/token', fastify.oauth2.token());
  fastify.post('/authorize', fastify.oauth2.authorize());
};

export default root;
