import { useEffect, useMemo, useRef } from 'react';
import { camelKeys } from 'js-convert-case';
import JsCookie from 'js-cookie';
import Echo from 'laravel-echo';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '@store';
import { driverSupportChatSelector } from '@store/client';
import { chatsActions, drawerChatsSelector } from '@store/common';
import { ChatMessage } from '@store/common/chats/types';
import { INotification, notificationsActions } from '@store/common/notifications';
import { authorizedUserSelector, globalActions, isUserAuthorizedSelector } from '@store/global';
import { isClientSide } from '@utils';

import { useWebsocketWatcher } from './use-websocket-watcher';

if (isClientSide()) {
    (window as any).Pusher = require('pusher-js');
}

const getEchoOptions = (authToken: string) => ({
    authEndpoint: `${process.env.pusherScheme}://${process.env.pusherHost}/api/broadcasting/auth`,
    auth: {
        headers: {
            Accept: 'application/json',
            Authorization: authToken,
        },
    },
    broadcaster: 'pusher',
    httpHost: process.env.pusherHost,
    httpsHost: process.env.pusherHost,
    wsHost: process.env.pusherHost,
    wssHost: process.env.pusherHost,
    key: process.env.pusherAppKey,
    wsPort: process.env.pusherPort,
    wssPort: process.env.pusherPort,
    forceTLS: false,
    disableStats: true,
    cluster: process.env.pusherAppCluster,
});

export const WebsocketWatcher = () => {
    const dispatch = useAppDispatch();
    const echoRef = useRef<Echo>();
    const router = useRouter();

    const isAuthorized = useAppSelector(isUserAuthorizedSelector);
    const authorizationToken = JsCookie.get('Authorization');
    const authorizedUser = useAppSelector(authorizedUserSelector);

    const drawerChats = useAppSelector(drawerChatsSelector);
    const supportChat = useAppSelector(driverSupportChatSelector);

    const isClient = isClientSide();

    useEffect(() => {
        if (isClient && isAuthorized && authorizationToken) {
            echoRef.current = new Echo(getEchoOptions(authorizationToken));
            console.log('WebSocket connection established');
            if (window) {
                (window as any).echo = echoRef.current;

                return () => {
                    console.log('WebSocket connection disconnected');
                    echoRef.current?.disconnect();
                };
            }
        }
    }, [authorizationToken, isAuthorized, isClient]);

    const prevChatsIds = useRef<string[]>([]);

    const chatsIds = useMemo(() => {
        if (!drawerChats) {
            return [];
        }

        const newChatsIds = drawerChats.map(({ publicId }) => publicId);

        if (JSON.stringify(newChatsIds) !== JSON.stringify(prevChatsIds.current)) {
            prevChatsIds.current = newChatsIds;

            return newChatsIds;
        }

        return prevChatsIds.current;
    }, [drawerChats]);

    const {
        handleOffersCountChange,
        handleRequestCountChange,
        updateDriverPaymentRequestsCount,
        handleOrderFromFileCreated,
        updateUnreadNotificationsCount,
        getChatInfoAction,
        updateIssuesCount,
    } = useWebsocketWatcher();

    useEffect(() => {
        if (isClient && chatsIds && echoRef.current) {
            const echo = echoRef.current;

            chatsIds.forEach(publicChatId => {
                echo.private(`chat.${publicChatId}`)
                    .listen('.chat.message.created', (message: unknown) => {
                        const preparedMessage = camelKeys(message, { recursive: true, recursiveInArray: true }) as ChatMessage;
                        const isMine = preparedMessage.creator?.accountPublicId === authorizedUser?.accountPublicId;
                        const isRead = !!preparedMessage.readAt;

                        dispatch(
                            chatsActions.appendMessagesToChat({
                                chatId: publicChatId,
                                isRead: isMine || isRead,
                                messages: [preparedMessage],
                                insertToEnd: true,
                                insertFromWebsocket: true,
                            }),
                        );

                        dispatch(
                            chatsActions.setLastReadMessageId({
                                chatId: publicChatId,
                                messagePublicId: isMine || isRead ? null : preparedMessage.publicId,
                            }),
                        );
                    })
                    .listen('.chat.message.updated', (message: unknown) => {
                        const preparedMessage = camelKeys(message, { recursive: true, recursiveInArray: true }) as ChatMessage;

                        dispatch(chatsActions.updateMessage({ chatId: publicChatId, message: preparedMessage }));

                        dispatch(
                            chatsActions.setDrawersChats(
                                drawerChats.map(drawerChat => {
                                    if (drawerChat.publicId === publicChatId && drawerChat.lastMessage?.publicId === preparedMessage?.publicId) {
                                        return {
                                            ...drawerChat,
                                            lastMessage: preparedMessage,
                                        };
                                    }

                                    return drawerChat;
                                }),
                            ),
                        );
                    })
                    .listen('.chat.message.deleted', (message: unknown) => {
                        const preparedMessage = camelKeys(message, { recursive: true, recursiveInArray: true }) as ChatMessage;

                        dispatch(chatsActions.deleteMessageFromChat({ chatId: publicChatId, messagePublicId: preparedMessage.publicId }));
                    })
                    .listen('.chat.updated', (event: unknown) => {
                        const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as { lastMessage: ChatMessage };

                        dispatch(
                            chatsActions.updateChatInDrawer({
                                chatId: publicChatId,
                                lastMessage: preparedEvent.lastMessage,
                            }),
                        );
                    });
            });

            prevChatsIds.current = chatsIds;

            return () => {
                chatsIds.forEach(publicChatId => {
                    echo.leave(`chat.${publicChatId}`);
                });
            };
        }
    }, [authorizedUser?.accountPublicId, dispatch, chatsIds, isClient, drawerChats]);

    useEffect(() => {
        if (isClient && supportChat && echoRef.current) {
            const echo = echoRef.current;

            echo.private(`chat.${supportChat.publicId}`)
                .listen('.chat.message.updated', (message: unknown) => {
                    const preparedMessage = camelKeys(message, { recursive: true, recursiveInArray: true }) as ChatMessage;

                    if (supportChat.lastMessage?.publicId === preparedMessage.publicId) {
                        dispatch(chatsActions.setDriverSupportChatLastMessage(preparedMessage));
                    }
                })
                .listen('.chat.message.deleted', (message: unknown) => {
                    const preparedMessage = camelKeys(message, { recursive: true, recursiveInArray: true }) as ChatMessage;

                    dispatch(chatsActions.deleteMessageFromChat({ chatId: supportChat.publicId, messagePublicId: preparedMessage.publicId }));
                })
                .listen('.chat.updated', (event: unknown) => {
                    const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as { lastMessage: ChatMessage };

                    dispatch(chatsActions.setDriverSupportChatLastMessage(preparedEvent.lastMessage));
                });

            return () => {
                echo.leave(`chat.${supportChat.publicId}`);
            };
        }
    }, [authorizedUser?.accountPublicId, dispatch, chatsIds, isClient, supportChat, drawerChats]);

    useEffect(() => {
        const publicId = authorizedUser?.publicId;

        if (isClient && publicId && echoRef.current) {
            const echo = echoRef.current;

            echo.private(`user.${publicId}`)
                .listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (notification: unknown) => {
                    const preparedNotification = camelKeys(notification, { recursive: true, recursiveInArray: true }) as INotification;

                    dispatch(notificationsActions.appendNotifications({ notifications: [preparedNotification], insertToStart: true }));
                    dispatch(globalActions.setCountOfNewOrders(preparedNotification.metadata.countOfNewOrders));
                })
                .listen('.user.chat.messages.unread.count.updated', (event: unknown) => {
                    const preparedEvent = camelKeys(event, { recursive: true, recursiveInArray: true }) as {
                        chat: { publicId: string; unreadMessageCount: number };
                        unreadChatMessagesCount: number;
                    };

                    const chat = drawerChats?.find(chat => chat.publicId === preparedEvent.chat.publicId);

                    if (chat) {
                        dispatch(chatsActions.setDrawerChatUnreadMessagesCount(preparedEvent.chat));
                    } else {
                        getChatInfoAction(preparedEvent.chat.publicId);
                    }

                    if (supportChat?.publicId === preparedEvent.chat.publicId) {
                        dispatch(chatsActions.setDriverSupportChatUnreadMessageCount(preparedEvent.chat.unreadMessageCount));
                    }

                    dispatch(globalActions.setUserUnreadChatMessagesCount(preparedEvent.unreadChatMessagesCount));
                })
                .listen('.user.notification_read', updateUnreadNotificationsCount)
                .listen('.user.notification_updated_to_unread', updateUnreadNotificationsCount)
                .listen('.user.notification_created', updateUnreadNotificationsCount)
                .listen('.order.created_from_file', handleOrderFromFileCreated)
                .listen('.driver_payment_requests_counter.updated', updateDriverPaymentRequestsCount)
                .listen('.issues_counter.updated', updateIssuesCount);

            return () => {
                echo.leave(`user.${publicId}`);
            };
        }
    }, [
        authorizedUser?.publicId,
        dispatch,
        drawerChats,
        getChatInfoAction,
        handleOrderFromFileCreated,
        isClient,
        router,
        updateUnreadNotificationsCount,
        updateDriverPaymentRequestsCount,
        updateIssuesCount,
        supportChat,
    ]);

    useEffect(() => {
        const echo = echoRef.current;

        const companyId = authorizedUser?.companyPublicId;

        if (isClient && companyId && echo) {
            echo.private(`company.${companyId}`)
                .listen('.order.request_created', handleRequestCountChange)
                .listen('.order.request_read', handleRequestCountChange)
                .listen('.order.request_created', handleRequestCountChange)
                .listen('.order.request_declined', handleRequestCountChange)
                .listen('.order.request_deleted', handleRequestCountChange)
                .listen('.order.offer_created', handleOffersCountChange)
                .listen('.order.offer_accepted', handleOffersCountChange)
                .listen('.order.offer_declined', handleOffersCountChange)
                .listen('.order.offer_canceled', handleOffersCountChange);

            return () => {
                echo.leave(`company.${companyId}`);
            };
        }
    }, [authorizedUser?.companyPublicId, handleRequestCountChange, handleOffersCountChange, isClient]);

    return null;
};
