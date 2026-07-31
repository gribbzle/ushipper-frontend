import React from 'react';

import { ChatMessageTypesEnum } from '@/enums';
import { ChatMessage } from '@store/common/chats/types';
import { isFileImage } from '@utils/files';
import { translateByNamespace } from '@utils/i18n';

const tCall = translateByNamespace('common:chats');

export const ChatAttachmentsInfo = ({ lastMessage }: { lastMessage: ChatMessage }) => {
    const { attachments, type } = lastMessage;
    const firstAttachment = attachments?.[0];
    const isCallLastMessage = type && [ChatMessageTypesEnum.INCOMING_CALL, ChatMessageTypesEnum.OUTGOING_CALL].includes(lastMessage.type);

    return (
        <>
            {!lastMessage.content && firstAttachment && isFileImage(firstAttachment.name) && 'Image'}
            {!lastMessage.content && firstAttachment && !isFileImage(firstAttachment.name) && (isCallLastMessage ? tCall('call-label') : firstAttachment.name)}
        </>
    );
};
