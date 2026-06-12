
import { Fastify, PluginRouter, PluginCors } from 'lemon-api/plugins/fastify'
import FastifyMultipart from '@fastify/multipart'

const server = Fastify({
    logger: {
        level: 'error'
    }
})

server.register(FastifyMultipart, {
    limits: {
        fileSize: 100 * 1024 * 1024
    }
})

server.register(PluginCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})

server.register(PluginRouter, { 
    directory: 'app' 
})

export { server }

