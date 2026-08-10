import React, { RefObject, useMemo } from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { ChatMessageExternalStatusesEnum } from '@/enums/chat-message-external-statuses-enum';
import { ChatMessageTypesEnum } from '@/enums/chat-message-types-enum';
import { ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { formatDuration } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

import { useChatMessageOrders } from '../../chat-message-orders/use-chat-message-orders';
import { ChatMessageHeader } from '../common/chat-message-header/chat-message-header';
import { ChatMessageWrapper } from '../common/chat-message-wrapper/chat-message-wrapper';

import { CallMessageIcon } from './call-message-icon/call-message-icon';

import './call-message.scss';

const cn = classname('call-message');
const tOrderId = translateByNamespace('client:order:details:fields');
const t = translateByNamespace('common:chats:call-external-statuses');
const tRecording = translateByNamespace('common:chats');

type CallMessageProps = Omit<ChatMessageType, 'publicId' | 'content' | 'systemMessageType'> & {
    isMine: boolean;
    chatId: string | null;
    itemRef: RefObject<HTMLDivElement> | null;
    view: 'light' | 'default';
    messagePublicId: string;
};

const CallDetailsTextMap: Record<ChatMessageExternalStatusesEnum, string> = {
    [ChatMessageExternalStatusesEnum.COMPLETED]: 'call',
    [ChatMessageExternalStatusesEnum.NO_ANSWER]: 'no-answer',
    [ChatMessageExternalStatusesEnum.CANCELED]: 'call',
    [ChatMessageExternalStatusesEnum.IN_PROGRESS]: 'call',
    [ChatMessageExternalStatusesEnum.RINGING]: 'queued',
    [ChatMessageExternalStatusesEnum.QUEUED]: 'queued',
    [ChatMessageExternalStatusesEnum.BUSY]: 'busy',
    [ChatMessageExternalStatusesEnum.FAILED]: 'failed',
    [ChatMessageExternalStatusesEnum.SENDING]: 'default',
    [ChatMessageExternalStatusesEnum.SENT]: 'default',
    [ChatMessageExternalStatusesEnum.DELIVERED]: 'default',
    [ChatMessageExternalStatusesEnum.UNDELIVERED]: 'default',
    [ChatMessageExternalStatusesEnum.RECEIVING]: 'default',
    [ChatMessageExternalStatusesEnum.RECEIVED]: 'default',
    [ChatMessageExternalStatusesEnum.ACCEPTED]: 'default',
    [ChatMessageExternalStatusesEnum.SCHEDULED]: 'default',
    [ChatMessageExternalStatusesEnum.READ]: 'default',
    [ChatMessageExternalStatusesEnum.ERROR]: 'default',
};

export const CallMessage = ({
    messagePublicId,
    attachments,
    creator,
    createdAt,
    type,
    order,
    isMine,
    chatId,
    externalStatus,
    itemRef,
    view,
}: CallMessageProps) => {
    const createdAtTime = useMemo(() => new Date(createdAt).toLocaleTimeString().substring(0, 5), [createdAt]);

    const description = useMemo(() => {
        if (!externalStatus) return null;

        const statusText = CallDetailsTextMap[externalStatus] || 'default';
        const callType = type === ChatMessageTypesEnum.INCOMING_CALL ? 'incoming' : 'outgoing';

        return t(`${callType}-${statusText}`);
    }, [type, externalStatus]);

    const showCallDescription = (!isMine && type === ChatMessageTypesEnum.INCOMING_CALL) || isMine;

    const duration = useMemo(() => {
        const firstAttachmentDuration = attachments?.[0]?.metadata?.duration;

        return firstAttachmentDuration ? formatDuration(firstAttachmentDuration) : null;
    }, [attachments]);

    const { handleClick } = useChatMessageOrders();

    return (
        <ChatMessageWrapper
            className={cn('call')}
            createdAt={createdAt}
            type={type}
            creator={creator}
            showOrderDetails={false}
            hasAvatar={false}
            itemRef={itemRef}
            view={view}
            chatId={chatId}
            messagePublicId={messagePublicId}
            attachments={attachments}
        >
            <div className={cn('wrapper')}>
                <div className={cn('', { mine: isMine })}>
                    {externalStatus && <CallMessageIcon view={externalStatus} />}
                    <div className={cn('content')}>
                        <ChatMessageHeader type={type} creator={creator} externalStatus={externalStatus} />
                        {order && (
                            <AlertBlock view={isMine ? 'plain' : 'disabled'}>
                                <span className={cn('order')} onClick={e => handleClick(e, order.publicId)}>
                                    {tOrderId('order-id-label')}: {order.orderId ? `${order.orderId}` : tOrderId('none')}
                                </span>
                            </AlertBlock>
                        )}
                        <div className={cn('details')}>
                            {showCallDescription && (
                                <span className={cn('value')}>
                                    {description}
                                    {duration && <>, {duration}</>}
                                </span>
                            )}
                            {!isMine && type === ChatMessageTypesEnum.OUTGOING_CALL && creator && (
                                <span className={cn('value-strong')}>
                                    {creator.name}
                                    {duration && <>, {duration}</>}
                                </span>
                            )}
                            {!duration && <span className={cn('value')}>{createdAtTime}</span>}
                        </div>
                    </div>
                </div>
                {!!attachments?.length && (
                    <div className={cn('attachments')}>
                        <p className={cn('attachments-label')}>{tRecording('recording-label')}</p>
                        {attachments.map(({ publicId, name, url }) => (
                            <a key={publicId} href={url} className={cn('attachments-link')}>
                                {name}
                            </a>
                        ))}
                        {duration && <span className={cn('value', { right: true })}>{createdAtTime}</span>}
                    </div>
                )}
            </div>
        </ChatMessageWrapper>
    );
};
