import config from 'config';
import fastify from 'fastify';
import path from 'path';
import fastifyCookie from '@fastify/cookie';
import fastifyHttpProxy from '@fastify/http-proxy';
import fastifyReply from '@fastify/reply-from';
import fastifyStatic from '@fastify/static';

import { registerMocks } from './mock';
import { registerUIroutes } from './register-ui-routes';

import '../src/i18n';

const mocksEnabled = process.env.MOCK;

const fastifyServer = fastify({ pluginTimeout: 60000 });
const port = config.get<number>('server.port');
const apiBaseUrl = config.get<number>('server.apiBaseUrl');

fastifyServer.register(fastifyCookie);

fastifyServer.register(fastifyStatic, {
    root: path.join(__dirname, process.env.NODE_ENV === 'development' ? '../public' : '../../public'),
    prefix: '/public/',
});

fastifyServer.register(fastifyReply);

if (mocksEnabled) {
    registerMocks(fastifyServer);
}

fastifyServer.register(fastifyHttpProxy, {
    upstream: apiBaseUrl,
    prefix: '/api',
    rewritePrefix: '/api',
    http: {
        requestOptions: {
            timeout: 60000,
        },
    },
    http2: false,
} as any);

registerUIroutes(fastifyServer);

(async () => {
    try {
        await fastifyServer.listen({ port, host: '0.0.0.0' });
        console.log(`> Ready on port ${port}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
