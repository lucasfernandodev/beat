import { resolve } from 'node:path'
import Fastify from 'fastify'
import FastifyVite from '@fastify/vite'


export class Server {
  private fs = Fastify();

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