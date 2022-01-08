import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import { registerExtraModels } from '@getf1tickets/sdk';
import models from '@/models';

declare module 'fastify' {
  export interface FastifyInstance {
    sequelize: Sequelize
  }
}

export default fp(async (fastify) => {
  await registerExtraModels(models as any, fastify, fastify.sequelize);
  await fastify.sequelize.sync();
}, {
  name: 'sdk-extra-model',
  dependencies: ['sdk-registration', 'sdk-sequelize'],
});
