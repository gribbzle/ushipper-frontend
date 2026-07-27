import { FastifyInstance } from 'fastify';

export const registerChatMessagesMock = (server: FastifyInstance) => {
    server.get('/api/chats/9915f471-6599-42f5-82f3-ff51128bff01/messages*', (req, reply) => {
        return reply.code(200).send({
            data: [
                {
                    public_id: '9915f471-6599-42f5-82f3-ff51128bff01',
                    system_message_type: null,
                    creator: {
                        name: 'Sarah Davis',
                        avatar: 'http://localhost:80/default-images/avatar.jpg',
                        role_name: 'ShipperAdmin',
                    },
                    content: 'Good idea',
                    is_read: false,
                    created_at: '2023-04-29T16:57:48Z',
                    attachments: [
                        {
                            public_id: '9915f471-6599-42f5-82f3-ff51128bff01',
                            url: 'http://localhost:80/default-images/image.png',
                            name: 'image.png',
                            extension: 'png',
                            size: 1048576,
                            creator: {
                                name: 'Sarah Davis',
                                avatar: 'http://localhost:80/default-images/avatar.jpg',
                                role_name: 'ShipperAdmin',
                            },
                            created_at: '2023-04-29T16:57:48Z',
                            updated_at: '2023-04-29T16:57:48Z',
                        },
                    ],
                },
            ],
            links: {
                prev: 'http://localhost:80/api/something?cursor=eyJoaXN0b3J5X2l0ZW1zLmlkIjoxLCJfcG9pbnRzVG9OZXh0SXRlbXMiOnRydWV9&other_parameters',
                next: 'http://localhost:80/api/something?cursor=eyJoaXN0b3J5X2l0ZW1zLmlkIjoxLCJfcG9pbnRzVG9OZXh0SXRlbXMiOnRydWV9&other_parameters',
            },
            meta: {
                path: 'http://localhost:80/api/something',
                per_page: 1,
                next_cursor: 'eyJoaXN0b3J5X2l0ZW1zLmlkIjoxLCJfcG9pbnRzVG9OZXh0SXRlbXMiOnRydWV9',
                prev_cursor: 'eyJoaXN0b3J5X2l0ZW1zLmlkIjoxLCJfcG9pbnRzVG9OZXh0SXRlbXMiOnRydWV9',
            },
        });
    });
};
