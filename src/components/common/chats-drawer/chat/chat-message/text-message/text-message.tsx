import React, { RefObject, useMemo } from 'react';

import { ChatMessageExternalStatusesEnum } from '@/enums/chat-message-external-statuses-enum';
import { ChatMessageTypesEnum } from '@/enums/chat-message-types-enum';
import { ChatTypesEnum } from '@/enums/chat-types-enum';
import { ExclamationCircleIcon, TickIcon } from '@icons';
import { ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ChatMessageContent, ChatMessageWrapper } from '../common';

import MessageReadStatusIcon from './message-read-status.svg';

import './text-message.scss';

const cn = classname('text-message');
const t = translateByNamespace('common:chats');

type TextMessageProps = Omit<ChatMessageType, 'publicId'> & {
    isMine: boolean;
    chatId: string | null;
    itemRef: RefObject<HTMLDivElement> | null;
    view: 'light' | 'default';
    chatType?: ChatTypesEnum | null;
    messagePublicId: string;
};

export const TextMessage = ({
    systemMessagePayload,
    creator,
    content,
    createdAt,
    editedAt,
    readAt,
    attachments,
    systemMessageType,
    type,
    order,
    isMine,
    chatId,
    externalStatus,
    itemRef,
    view,
    chatType,
    messagePublicId,
}: TextMessageProps) => {
    const showErrorMessageIcon = externalStatus === ChatMessageExternalStatusesEnum.ERROR && type === ChatMessageTypesEnum.OUTGOING_SMS;
    const createdAtTime = useMemo(() => new Date(createdAt).toLocaleTimeString().substring(0, 5), [createdAt]);
    const showOrderDetails = type !== ChatMessageTypesEnum.MESSAGE && !!order;
    const isMessageType = type === ChatMessageTypesEnum.MESSAGE;

    return (
        <ChatMessageWrapper
            createdAt={createdAt}
            type={type}
            creator={creator}
            order={order}
            showOrderDetails={showOrderDetails}
            showMessageOptions={isMessageType}
            hasAvatar={true}
            itemRef={itemRef}
            view={view}
            chatId={chatId}
            chatType={chatType ?? null}
            messagePublicId={messagePublicId}
            attachments={attachments}
            messageContent={content}
        >
            <ChatMessageContent
                attachments={attachments}
                content={content}
                creator={creator}
                systemMessageType={systemMessageType}
                systemMessagePayload={systemMessagePayload}
            />

            <div className={cn('details')}>
                {!showOrderDetails && !!editedAt && <span className={cn('time-value')}>{t('edited-label', { time: createdAtTime })}</span>}
                {!showOrderDetails && !editedAt && <span className={cn('time-value')}>{createdAtTime}</span>}
                {isMine && (readAt || externalStatus === ChatMessageExternalStatusesEnum.DELIVERED) && <MessageReadStatusIcon className={cn('time-icon')} />}
                {isMine && !readAt && externalStatus !== ChatMessageExternalStatusesEnum.DELIVERED && <TickIcon className={cn('time-icon')} />}
                {showErrorMessageIcon && <ExclamationCircleIcon className={cn('time-icon', { error: showErrorMessageIcon })} />}
            </div>
        </ChatMessageWrapper>
    );
};
