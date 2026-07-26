import React, { useEffect } from 'react';

import { ChatMessageTypesEnum, ChatTypesEnum } from '@/enums';
import useInViewport from '@/hooks/use-in-viewport';
import { useAppSelector } from '@store';
import { ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { authorizedUserAccountPublicIdSelector } from '@store/global';

import { CallMessage } from './call-message';
import { TextMessage } from './text-message';

type ChatMessageProps = ChatMessageType & {
    readMessageCallback?: (messagePublicId: string) => void;
    notInViewCallback?: () => void;
    isRead: boolean;
    chatId: string | null;
    view: 'light' | 'default';
    chatType: ChatTypesEnum | null;
};

export const ChatMessage = ({
    systemMessagePayload,
    creator,
    publicId,
    content,
    createdAt,
    editedAt,
    readAt,
    readMessageCallback,
    notInViewCallback,
    attachments,
    systemMessageType,
    isRead,
    type,
    order,
    chatId,
    externalStatus,
    view,
    chatType,
}: ChatMessageProps) => {
    const authorizedUserAccountPublicId = useAppSelector(authorizedUserAccountPublicIdSelector);

    const isIncomingMessage = [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.INCOMING_SMS].includes(type);
    const isCallMessage = [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.OUTGOING_CALL].includes(type);
    const isMine = creator?.accountPublicId === authorizedUserAccountPublicId && !isIncomingMessage;

    const { isInViewport, itemRef } = useInViewport();

    useEffect(() => {
        const shouldMarkAsRead = ((isMine && systemMessageType) || !isMine) && !isRead;

        if (shouldMarkAsRead && isInViewport) {
            readMessageCallback?.(publicId);
        }
        if (shouldMarkAsRead && !isInViewport && notInViewCallback) {
            notInViewCallback();
        }
    }, [systemMessageType, isMine, isRead, publicId, readMessageCallback, isInViewport, notInViewCallback]);

    return isCallMessage ? (
        <CallMessage
            key={publicId}
            creator={creator}
            type={type}
            externalStatus={externalStatus}
            createdAt={createdAt}
            readAt={readAt}
            order={order}
            chatId={chatId}
            isMine={isMine}
            itemRef={itemRef}
            view={view}
            attachments={attachments}
            messagePublicId={publicId}
        />
    ) : (
        <TextMessage
            key={publicId}
            systemMessageType={systemMessageType}
            systemMessagePayload={systemMessagePayload}
            attachments={attachments}
            content={content}
            creator={creator}
            type={type}
            externalStatus={externalStatus}
            createdAt={createdAt}
            editedAt={editedAt}
            readAt={readAt}
            order={order}
            chatId={chatId}
            isMine={isMine}
            itemRef={itemRef}
            view={view}
            chatType={chatType}
            messagePublicId={publicId}
        />
    );
};
