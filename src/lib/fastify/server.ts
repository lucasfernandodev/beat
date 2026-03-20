import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { resolve } from 'node:path'
import Fastify, { type FastifyBaseLogger, type FastifyInstance, type FastifyPluginAsync, type FastifyPluginOptions, type RawReplyDefaultExpression, type RawRequestDefaultExpression, type RawServerBase, type RawServerDefault } from 'fastify'
import FastifyVite from '@fastify/vite'
import { ApiPatientsRoute } from '../../infra/http/routes/patient/index.ts';
import { fastifyErrorHandle } from './error-handle.ts';
import { ApiPressureRoute } from '../../infra/http/routes/pressure/index.ts';

declare global {
  type FastifyPluginAsyncZod<
    Options extends FastifyPluginOptions = Record<never, never>,
    Server extends RawServerBase = RawServerDefault> = FastifyPluginAsync<Options,
      Server,
      ZodTypeProvider
    >;
}

export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>

export class Server {
  private fs = Fastify().withTypeProvider<ZodTypeProvider>();

  constructor() {
    this.fs.setValidatorCompiler(validatorCompiler);
    this.fs.setSerializerCompiler(serializerCompiler);
    this.fs.setErrorHandler(fastifyErrorHandle)
  }

  private loadPlugins = async () => {
    await this.fs.register(FastifyVite, {
      root: resolve(import.meta.dirname, '..', '..', '..'),
      distDir: resolve(import.meta.dirname, '..', '..', '..', 'build'), // Must match build.outDir in Vite config
      dev: process.argv.includes('--dev'),
      spa: true,
    })
  }

  private registerRouters = async () => {
    this.fs.get('/', (req, reply) => {
      return reply.html()
    })

    await this.fs.register(ApiPatientsRoute, {
      prefix: '/api'
    })

    await this.fs.register(ApiPressureRoute, {
      prefix: '/api'
    })

    // Make front-end routes working correctly
    this.fs.get('/*', (req, reply) => {
      if (req.url.startsWith('/api/')) {
        return reply.callNotFound()
      }
      return reply.html()
    })
  }

  private start = async () => {
    await this.fs.vite.ready()
    await this.fs.listen({ port: 3000, host: '0.0.0.0' })
    console.info("Server open on 0.0.0.0:3000")
  }

  public init = async () => {
    await this.loadPlugins()
    await this.registerRouters()
    await this.start()
  }
}