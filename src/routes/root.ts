import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/token', fastify.oauth2.token());
};

export default root;
