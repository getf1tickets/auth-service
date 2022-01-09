import fp from 'fastify-plugin';
import { registerPlugins } from '@getf1tickets/sdk';

// types import
import 'fastify-sensible';

export default fp(async (fastify) => {
  await registerPlugins(fastify);
}, {
  name: 'sdk-registration',
});
