import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ChatMessageTypesEnum, ChatTypesEnum } from '@/enums';
import useMessageContent from '@/hooks/chat/use-message-content';
import { ChatAttachmentsInfo } from '@components';
import { useMeAdmin } from '@hooks';
import { ThumbtackIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, selectedChatIdSelector } from '@store/common';
import { ChatShortInfo } from '@store/common/chats/types';
import { authorizedUserAccountPublicIdSelector } from '@store/global';
import { classname, diffForHumans, translateByNamespace } from '@utils';

import { ChatItemBadge } from './chat-item-badge';
import { ChatItemExternalNumber } from './chat-item-external-number';
import { ChatItemOrderDetails } from './chat-item-order-details';
import { SupportChatHeader } from './support-chat-header';

import './chats-list-block-item.scss';

const t = translateByNamespace('common:chats');

const cn = classname('chats-list-block-item');

export const ChatListBlockItem = ({ chat, isDriverSupportChat = false }: { chat: ChatShortInfo; isDriverSupportChat?: boolean }) => {
    const dispatch = useAppDispatch();
    const isMeAdmin = useMeAdmin();

    const { publicId, externalNumber, lastMessage, type, account } = chat;
    const { type: lastMessageType, creator, content: lastMessageContent, systemMessageType, systemMessagePayload, externalStatus } = lastMessage || {};
    const authorizedUserAccountPublicId = useAppSelector(authorizedUserAccountPublicIdSelector);
    const selectedChatId = useSelector(selectedChatIdSelector);

    const isCallLastMessage = lastMessageType && [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.OUTGOING_CALL].includes(lastMessageType);

    const content = useMessageContent({
        creator: creator || null,
        content: lastMessageContent || '',
        systemMessageType: systemMessageType || null,
        systemMessagePayload: systemMessagePayload,
        externalStatus: externalStatus,
    });

    const isSupportChat = type === ChatTypesEnum.SUPPORT;

    const onChatSelectHandler = useCallback(
        async (newSelectedChatId: string) => {
            if (selectedChatId !== newSelectedChatId) {
                if (isDriverSupportChat) {
                    await dispatch(chatsActions.appendDrawersChats([chat]));
                }
                dispatch(chatsActions.initializeChatState(newSelectedChatId));
                dispatch(chatsActions.setSelectedChatId(newSelectedChatId));
            }
        },
        [dispatch, selectedChatId, isDriverSupportChat, chat],
    );

    const messageCreator = useMemo(() => {
        if (authorizedUserAccountPublicId === creator?.accountPublicId) {
            return t('you-text');
        }

        if (isSupportChat && !isMeAdmin) {
            return t('support-chat-header');
        }

        return creator?.name;
    }, [isSupportChat, creator, authorizedUserAccountPublicId, isMeAdmin]);

    const unreadMessageCounter = useMemo(() => {
        if (chat?.unreadMessageCount > 0) {
            return <span className={cn('count')}>{chat.unreadMessageCount}</span>;
        }

        return null;
    }, [chat?.unreadMessageCount]);

    const createdAtTime = useMemo(() => {
        if (chat?.lastMessage?.createdAt) {
            return <span className={cn('time')}>{diffForHumans(new Date(chat.lastMessage.createdAt), true)}</span>;
        }

        return null;
    }, [chat?.lastMessage?.createdAt]);

    return (
        <div
            key={publicId}
            className={cn('', { selected: selectedChatId === publicId, support: isSupportChat && !isMeAdmin })}
            onClick={() => onChatSelectHandler(publicId)}
        >
            <ChatItemBadge chat={chat} />

            <div className={cn('content')}>
                <div className={cn('row')}>
                    <>
                        {!isSupportChat && <ChatItemOrderDetails chat={chat} showPaymentInformation={false} />}
                        {isSupportChat && <SupportChatHeader accountName={account?.name} />}
                        {type === ChatTypesEnum.BETWEEN_PHONES && <ChatItemExternalNumber externalNumber={externalNumber} />}
                    </>
                    {createdAtTime}
                </div>

                <div className={cn('row')}>
                    <div className={cn('last-message')}>
                        {chat?.lastMessage && (
                            <p>
                                {!systemMessageType && !isCallLastMessage && <span className={cn('last-message-creator')}>{messageCreator}:</span>}{' '}
                                <ChatAttachmentsInfo lastMessage={chat?.lastMessage} /> {content}
                            </p>
                        )}
                        {!chat?.lastMessage && <p>{t('no-messages-placeholder')}</p>}
                    </div>
                    {isSupportChat && !isMeAdmin && <ThumbtackIcon className={cn('icon-thumbtack')} />}
                    {unreadMessageCounter}
                </div>
            </div>
        </div>
    );
};
