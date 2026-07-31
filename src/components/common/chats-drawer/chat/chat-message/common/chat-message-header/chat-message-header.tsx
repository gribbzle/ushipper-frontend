import React from 'react';

import { ChatMessageExternalStatusesEnum, ChatMessageTypesEnum } from '@/enums';
import { useAppSelector } from '@store';
import { ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { authorizedUserAccountPublicIdSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './chat-message-header.scss';

const cn = classname('chat-message-header');

const externalStatusMessages = translateByNamespace('client:order:external-status-messages');

type ChatMessageHeaderProps = Pick<ChatMessageType, 'creator' | 'type' | 'externalStatus'>;

export const ChatMessageHeader = ({ creator, type, externalStatus }: ChatMessageHeaderProps) => {
    const authorizedUserAccountPublicId = useAppSelector(authorizedUserAccountPublicIdSelector);
    const isIncomingMessage = [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.INCOMING_SMS].includes(type);
    const isMine = creator?.accountPublicId === authorizedUserAccountPublicId && !isIncomingMessage;
    const isCallMessage = [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.OUTGOING_CALL].includes(type);
    const isMissedIncomingCall = type === ChatMessageTypesEnum.INCOMING_CALL && !isMine && externalStatus === ChatMessageExternalStatusesEnum.NO_ANSWER;

    return (
        <>
            {isCallMessage && externalStatus && (
                <h4 className={cn('', { mine: isMine, missed: isMissedIncomingCall })}>
                    {isMissedIncomingCall ? externalStatusMessages('missed-call') : externalStatusMessages<string>(externalStatus, { status: externalStatus })}
                </h4>
            )}
        </>
    );
};
