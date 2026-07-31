import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import { ChatTypesEnum } from '@/enums';
import { useDebouncedGetChatInfo } from '@/hooks/chat/use-debounced-get-chat-info';
import { useDebouncedGetChatMessages } from '@/hooks/chat/use-debounced-get-chat-messages';
import { useDebouncedGetChatReadMessages } from '@/hooks/chat/use-debounced-get-chat-read-messages';
import { useDebouncedGetChatUnreadMessages } from '@/hooks/chat/use-debounced-get-chat-unread-messages';
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
import { RequestStatus } from '@utils/redux';

import { ChatMessage } from './chat-message/chat-message';
import { ChatProps } from './chat.types';
import { ChatControls } from './chat-controls';
import { ChatEmptyBlock } from './chat-empty-block';
import { ChatHead } from './chat-head';
import { ChatMessageDelimiter, ChatUnreadMessageDelimiter } from './chat-message-delimiter';
import { useFetchChatBetweenPhones } from './use-fetch-chat-between-phones';

export type { ChatProps } from './chat.types';

import './chat.scss';

const cn = classname('chat');

export const Chat = ({ chatId, mode = 'drawer', hideControls, isNeedInitialize = true, headerComponent, externalPhone, callback }: ChatProps) => {
    const dispatch = useAppDispatch();

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const getChatMessagesRequestRef = useRef<ChatFullInfo['getChatMessagesRequest'] | null>();
    const getChatUnreadMessagesRequestRef = useRef<ChatFullInfo['getChatUnreadMessagesRequest'] | null>();
    const internalPhone = useAppSelector(authorizedUserTwilioPhoneSelector);

    const { fetchedChat, fetchChatBetweenPhones } = useFetchChatBetweenPhones({ internalPhone, externalPhone });

    const finalChatId = chatId || fetchedChat?.publicId || null;

    const chatType = useAppSelector(chatTypeChatSelector(finalChatId));

    const finalChatType = chatType || fetchedChat?.type || null;

    const scrollToBottom = useCallback(() => {
        const messagesContainer = messagesContainerRef.current;

        messagesContainer?.scrollTo(0, messagesContainer?.scrollHeight);
    }, []);

    const getChatInfoDebounced = useDebouncedGetChatInfo(finalChatId);
    const getChatUnreadMessagesDebounced = useDebouncedGetChatUnreadMessages(finalChatId);
    const getChatMessagesDebounced = useDebouncedGetChatMessages(finalChatId);
    const getChatReadMessagesDebounced = useDebouncedGetChatReadMessages(finalChatId);

    useEffect(() => {
        if (finalChatId && isNeedInitialize) {
            dispatch(chatsActions.initializeChatState(finalChatId));
            getChatInfoDebounced();
            getChatMessagesDebounced(scrollToBottom);
            getChatUnreadMessagesDebounced();
        }
    }, [finalChatId, dispatch, getChatInfoDebounced, getChatMessagesDebounced, getChatUnreadMessagesDebounced, isNeedInitialize, scrollToBottom]);

    const messages = useAppSelector(chatMessagesSelector(finalChatId));
    const unreadMessages = useAppSelector(chatUnreadMessagesSelector(finalChatId));
    const chatInfo = useSelector(chatInfoSelector(finalChatId));

    const showChatControls = useMemo(
        () =>
            (internalPhone === chatInfo?.internalNumber && finalChatType === ChatTypesEnum.BETWEEN_PHONES) ||
            (!hideControls && finalChatType !== ChatTypesEnum.BETWEEN_PHONES),
        [chatInfo?.internalNumber, finalChatType, hideControls, internalPhone],
    );

    const getChatMessagesRequest = useSelector(chatMessagesRequestSelector(finalChatId));
    const getChatUnreadMessagesRequest = useSelector(chatUnreadMessagesRequestSelector(finalChatId));

    const lastReadMessageIdActionRef = useRef<string | null>(null);

    const unreadMessagesRef = useRef<ChatMessageType[]>();

    useEffect(() => {
        unreadMessagesRef.current = unreadMessages;
    }, [unreadMessages]);

    /*
     Перестраховка на случай, если события прочтения произойдут не в порядке перечисления сообщений,
     т.к. бэк ставит указать последнего прочитанного по publicId в последнем вызове на чтение сообщения
    */

    const handleResetLastMessageId = useCallback(() => {
        lastReadMessageIdActionRef.current = null;
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
        getChatMessagesRequestRef.current = getChatMessagesRequest;
        getChatUnreadMessagesRequestRef.current = getChatUnreadMessagesRequest;
    }, [getChatMessagesRequest, getChatUnreadMessagesRequest]);

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
    }, [dispatch, finalChatId, getChatMessagesDebounced, getChatUnreadMessagesDebounced, onScrollHandler]);

    const messagesBlocks = useMemo(() => {
        if (!messages) {
            return {};
        }

        const result = {} as { [key: string]: ChatMessageType[] };

        messages.forEach(message => {
            const date = new Date(message.createdAt).toLocaleDateString();

            if (!result[date]) {
                result[date] = [];
            }

            result[date].push(message);
        });

        return result;
    }, [messages]);

    const isChatEmpty =
        getChatMessagesRequest?.status === RequestStatus.SUCCESS &&
        !messages?.length &&
        getChatUnreadMessagesRequest?.status === RequestStatus.SUCCESS &&
        !unreadMessages.length;

    const lastReadMessageId = useAppSelector(lastReadMessageIdSelector(finalChatId));

    const notInViewCallback = useCallback(() => {
        const chatsContainer = messagesContainerRef.current;

        if (chatsContainer) {
            chatsContainer.scrollTop = chatsContainer.scrollHeight;
        }
    }, []);

    return (
        <div className={cn('', { mode })}>
            <ChatHead chatInfo={chatInfo} mode={mode} showCallButton={showChatControls} headerComponent={headerComponent} />
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
                                    view={finalChatType === ChatTypesEnum.BETWEEN_PHONES ? 'light' : 'default'}
                                    chatType={finalChatType}
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
                                view={finalChatType === ChatTypesEnum.BETWEEN_PHONES ? 'light' : 'default'}
                                chatType={finalChatType}
                            />
                        </Fragment>
                    ))}
                {isChatEmpty && <ChatEmptyBlock />}
            </div>
            {showChatControls && (
                <ChatControls
                    chatId={finalChatId}
                    externalPhone={externalPhone}
                    chatType={finalChatType}
                    callback={callback ? () => callback(finalChatId) : scrollToBottom}
                    fetchPhoneChatDetails={fetchChatBetweenPhones}
                />
            )}
        </div>
    );
};
