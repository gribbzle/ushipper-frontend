import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { ChatEmptyBlock, ChatHead, ChatMessage, ChatMessageDelimiter, ChatUnreadMessageDelimiter } from '@/components/common/chats-drawer/chat';
import { ChatTypesEnum } from '@/enums';
import { useDebouncedGetChatInfo, useDebouncedGetChatMessages, useDebouncedGetChatReadMessages, useDebouncedGetChatUnreadMessages } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import {
    chatInfoSelector,
    chatMessagesRequestSelector,
    chatMessagesSelector,
    chatsActions,
    chatTypeChatSelector,
    chatUnreadMessagesRequestSelector,
    chatUnreadMessagesSelector,
    lastReadMessageIdSelector,
} from '@store/common';
import { ChatFullInfo, ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { authorizedUserTwilioPhoneSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';

import { MessageControls } from './message-controls';

import './chat-block.scss';

const cn = classname('chat-block');
const t = translateByNamespace('common:messages-page:chat-block');

export type ChatBlockProps = {
    chatId: string | null;
    hasBorderRadius: boolean;
    mode?: 'page' | 'drawer';
};

export const ChatBlock = ({ chatId, hasBorderRadius, mode = 'page' }: ChatBlockProps) => {
    const dispatch = useAppDispatch();
    const internalPhone = useAppSelector(authorizedUserTwilioPhoneSelector);
    const chatType = useAppSelector(chatTypeChatSelector(chatId));

    const getChatMessagesRequest = useSelector(chatMessagesRequestSelector(chatId));
    const getChatUnreadMessagesRequest = useSelector(chatUnreadMessagesRequestSelector(chatId));
    const messages = useAppSelector(chatMessagesSelector(chatId));
    const unreadMessages = useAppSelector(chatUnreadMessagesSelector(chatId));
    const lastReadMessageId = useAppSelector(lastReadMessageIdSelector(chatId));
    const chatInfo = useSelector(chatInfoSelector(chatId));

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const unreadMessagesRef = useRef<ChatMessageType[]>();
    const lastReadMessageIdActionRef = useRef<string | null>(null);
    const getChatMessagesRequestRef = useRef<ChatFullInfo['getChatMessagesRequest'] | null>();
    const getChatUnreadMessagesRequestRef = useRef<ChatFullInfo['getChatUnreadMessagesRequest'] | null>();

    const getChatInfoDebounced = useDebouncedGetChatInfo(chatId);
    const getChatUnreadMessagesDebounced = useDebouncedGetChatUnreadMessages(chatId);
    const getChatMessagesDebounced = useDebouncedGetChatMessages(chatId);
    const getChatReadMessagesDebounced = useDebouncedGetChatReadMessages(chatId);

    const scrollToBottom = useCallback(() => {
        const messagesContainer = messagesContainerRef.current;

        messagesContainer?.scrollTo(0, messagesContainer?.scrollHeight);
    }, []);

    const handleResetLastMessageId = useCallback(() => {
        lastReadMessageIdActionRef.current = null;
    }, []);

    const notInViewCallback = useCallback(() => {
        const chatsContainer = messagesContainerRef.current;

        if (chatsContainer) {
            chatsContainer.scrollTop = chatsContainer.scrollHeight;
        }
    }, []);

    const onReadMessageHandler = useCallback(
        (messagePublicId: string) => {
            if (lastReadMessageIdActionRef.current) {
                const indexLastReadMessage = unreadMessages.findIndex(({ publicId }) => publicId === lastReadMessageIdActionRef.current);
                const indexMessage = unreadMessages.findIndex(({ publicId }) => publicId === messagePublicId);

                if (indexLastReadMessage < indexMessage) {
                    lastReadMessageIdActionRef.current = messagePublicId;
                }
            } else {
                lastReadMessageIdActionRef.current = messagePublicId;
            }

            getChatReadMessagesDebounced(lastReadMessageIdActionRef.current, handleResetLastMessageId);
        },
        [unreadMessages, handleResetLastMessageId, getChatReadMessagesDebounced],
    );

    useEffect(() => {
        if (chatId) {
            dispatch(chatsActions.initializeChatState(chatId));
            getChatInfoDebounced();
            getChatMessagesDebounced(scrollToBottom);
            getChatUnreadMessagesDebounced();
        }
    }, [chatId, dispatch, scrollToBottom, getChatInfoDebounced, getChatMessagesDebounced, getChatUnreadMessagesDebounced]);

    useEffect(() => {
        unreadMessagesRef.current = unreadMessages;
        getChatMessagesRequestRef.current = getChatMessagesRequest;
        getChatUnreadMessagesRequestRef.current = getChatUnreadMessagesRequest;
    }, [getChatMessagesRequest, getChatUnreadMessagesRequest, unreadMessages]);

    const onScrollHandler = useCallback(
        (event: Event) => {
            const target = event.target;

            if (!(target instanceof HTMLDivElement)) {
                return;
            }

            const isListScrolledToTop = target.scrollTop < 300;
            const isListScrolledToBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 300;

            if (isListScrolledToTop) {
                const getMessagesRequest = getChatMessagesRequestRef.current;
                const isNextRequestAvailable = getMessagesRequest?.status === RequestStatus.NONE || getMessagesRequest?.nextCursor;

                if (isNextRequestAvailable) {
                    getChatMessagesDebounced();
                }
            } else if (isListScrolledToBottom) {
                const getChatUnreadMessagesRequest = getChatUnreadMessagesRequestRef.current;
                const isNextRequestAvailable = getChatUnreadMessagesRequest?.status === RequestStatus.NONE || getChatUnreadMessagesRequest?.nextCursor;

                if (isNextRequestAvailable) {
                    getChatUnreadMessagesDebounced();
                }
            }
        },
        [getChatMessagesDebounced, getChatUnreadMessagesDebounced],
    );

    useEffect(() => {
        const chatsContainer = messagesContainerRef.current;

        if (!chatsContainer) {
            return;
        }

        chatsContainer.addEventListener('scroll', onScrollHandler);

        return () => chatsContainer.removeEventListener('scroll', onScrollHandler);
    }, [dispatch, chatId, getChatMessagesDebounced, getChatUnreadMessagesDebounced, onScrollHandler]);

    const showChatControls = useMemo<boolean>(
        () => chatType !== ChatTypesEnum.BETWEEN_PHONES || (internalPhone === chatInfo?.internalNumber && chatType === ChatTypesEnum.BETWEEN_PHONES),
        [chatInfo?.internalNumber, chatType, internalPhone],
    );

    const isChatEmpty =
        getChatMessagesRequest?.status === RequestStatus.SUCCESS &&
        !messages?.length &&
        getChatUnreadMessagesRequest?.status === RequestStatus.SUCCESS &&
        !unreadMessages.length;

    const messagesBlocks = useMemo(() => {
        if (!messages) {
            return {};
        }

        const result: { [key: string]: ChatMessageType[] } = {};
        const today = new Date().toLocaleDateString();

        messages.forEach(message => {
            const messageDate = new Date(message.createdAt).toLocaleDateString();
            const dateKey = messageDate === today ? t('today') : messageDate;

            if (!result[dateKey]) {
                result[dateKey] = [];
            }

            result[dateKey].push(message);
        });

        return result;
    }, [messages]);

    return (
        <div className={cn('', { border: hasBorderRadius, mode })}>
            {mode === 'page' && <ChatHead chatInfo={chatInfo} showCallButton={showChatControls} formatAsExternal={true} isMessagesPage={true} />}
            <div className={cn('messages')} ref={messagesContainerRef}>
                {Object.entries(messagesBlocks).map(([date, messages]) => (
                    <Fragment key={date}>
                        <ChatMessageDelimiter date={date} />
                        {messages.map(message => (
                            <Fragment key={message.publicId}>
                                {message.publicId === lastReadMessageId && <ChatUnreadMessageDelimiter />}
                                <ChatMessage
                                    key={message.publicId}
                                    {...message}
                                    isRead={true}
                                    chatId={chatId}
                                    view={chatType === ChatTypesEnum.BETWEEN_PHONES ? 'light' : 'default'}
                                    chatType={chatType ?? null}
                                />
                            </Fragment>
                        ))}
                    </Fragment>
                ))}

                {unreadMessages.length > 0 &&
                    unreadMessages.map(message => (
                        <Fragment key={message.publicId}>
                            {message.publicId === lastReadMessageId && <ChatUnreadMessageDelimiter />}

                            <ChatMessage
                                key={message.publicId}
                                {...message}
                                readMessageCallback={onReadMessageHandler}
                                notInViewCallback={notInViewCallback}
                                isRead={false}
                                chatId={chatId}
                                view={chatType === ChatTypesEnum.BETWEEN_PHONES ? 'light' : 'default'}
                                chatType={chatType ?? null}
                            />
                        </Fragment>
                    ))}
                {isChatEmpty && <ChatEmptyBlock />}
            </div>
            {showChatControls && !!chatId && !!chatType && (
                <MessageControls chatId={chatId} chatType={chatType} callback={scrollToBottom} externalPhone={chatInfo?.externalNumber} />
            )}
        </div>
    );
};
