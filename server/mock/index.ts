import { FastifyInstance } from 'fastify';

import { registerChatMessagesMock } from './chat-messages-mock';
import { registerChatsMock } from './chats-mock';

export const registerMocks = (server: FastifyInstance) => {
    server.post<{
        Body: { verify_code: string };
    }>('/api/confirm-registration', (req, reply) => {
        if (req.body['verify_code'] === 'CORRECT_VERIFY_CODE') {
            return reply.code(200).send();
        }

        return reply.code(422).send();
    });

    registerChatsMock(server);
    registerChatMessagesMock(server);
};
