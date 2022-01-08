import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload';
import { FastifyPluginAsync } from 'fastify';
import { registerPlugins } from '@getf1tickets/sdk';

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // register sdk plugins
  await registerPlugins(fastify);

  // no custom plugin for now
  // void fastify.register(AutoLoad, {
  //   dir: join(__dirname, 'plugins'),
  //   options: opts
  // })

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  });
};

export default app;
export { app };
