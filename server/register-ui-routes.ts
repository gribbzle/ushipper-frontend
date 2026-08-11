import config from 'config';
import { FastifyInstance } from 'fastify';
import fastifyNextJS from '@fastify/nextjs';

const port = config.get<number>('server.port');

const clientPagesPath = `http://localhost:${port}/client`;
const adminPagesPath = `http://localhost:${port}/admin`;

const routesAlias = [
    { alias: '/', path: `${clientPagesPath}/orders` },
    { alias: '/sign-in', path: `${clientPagesPath}/sign-in` },
    { alias: '/sign-up', path: `${clientPagesPath}/sign-up` },
    { alias: '/sign-up-confirmation', path: `${clientPagesPath}/sign-up-confirmation` },
    { alias: '/password-recovery', path: `${clientPagesPath}/password-recovery` },
    { alias: '/password-reset', path: `${clientPagesPath}/password-reset` },
    { alias: '/staff', path: `${clientPagesPath}/staff` },
    { alias: '/contacts', path: `${clientPagesPath}/contacts` },
    { alias: '/available-orders', path: `${clientPagesPath}/loadboard` },
    { alias: '/settings/roles', path: `${clientPagesPath}/settings/roles` },
    { alias: '/settings/company', path: `${clientPagesPath}/settings/company` },

    { alias: '/orders', path: `${clientPagesPath}/orders` },
    { alias: '/orders/create', path: `${clientPagesPath}/orders/create` },
    { alias: '/orders/:order', path: ({ order }: any) => `${clientPagesPath}/orders/${order}` },
    { alias: '/orders/:order/edit', path: ({ order }: any) => `${clientPagesPath}/orders/${order}/edit` },

    { alias: '/shipper-requests', path: `${clientPagesPath}/shipper-requests` },
    { alias: '/offers', path: `${clientPagesPath}/offers` },
    { alias: '/drivers-plan', path: `${clientPagesPath}/drivers-plan` },
    { alias: '/black-list', path: `${clientPagesPath}/black-list` },
    { alias: '/tracking', path: `${clientPagesPath}/tracking` },
    { alias: '/messages', path: `${clientPagesPath}/messages` },
    { alias: '/bols/:order', path: ({ order }: any) => `${clientPagesPath}/order-bols/${order}` },
    { alias: '/companies/:company', path: ({ company }: any) => `${clientPagesPath}/companies/${company}` },

    { alias: '/dashboard', path: `${clientPagesPath}/dashboard` },
    { alias: '/wallet', path: `${clientPagesPath}/wallet` },
    { alias: '/catalogs/carriers', path: `${clientPagesPath}/catalogs/carriers` },
    { alias: '/catalogs/dispatchers', path: `${clientPagesPath}/catalogs/dispatchers` },
    { alias: '/catalogs/drivers', path: `${clientPagesPath}/catalogs/drivers` },
    { alias: '/job-offers', path: `${clientPagesPath}/job-offers` },
    { alias: '/carriers', path: `${clientPagesPath}/carriers` },
    { alias: '/drivers', path: `${clientPagesPath}/drivers` },
    { alias: '/profile-settings', path: `${clientPagesPath}/profile-settings` },

    { alias: '/admin', path: `${adminPagesPath}/administrators` },
    { alias: '/admin/', path: `${adminPagesPath}/administrators` },
];

export const registerUIroutes = (server: FastifyInstance) => {
    for (const route of routesAlias) {
        server.get(route.alias, (request, reply) => {
            const replySource = typeof route.path === 'function' ? route.path(request.params) : route.path;

            reply.from(replySource);
        });
    }

  // @ts-ignore
  server.register(fastifyNextJS, {
    dev: process.env.NODE_ENV !== 'production',
    hostname: 'localhost',
    port: port,
    noStackTrace: true,
  }).after(() => {
        //@ts-ignore
        server.next('/*', (app, req, reply) => {
            // @ts-ignore
            app.render(req.raw, reply.raw, req.url.split('?')[0], req.query, {});
        });
    });
};
