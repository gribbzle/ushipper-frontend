import React from 'react';

import useMessageContent from '@/hooks/chat/use-message-content';
import { convertBytesToMB } from '@/utils/converter';
import { ImageProvider } from '@/providers/ImageProvider';
import { ChatMessage as ChatMessageType } from '@store/common/chats/types';
import { ImageView } from '@/components/ui/surfaces/image';
import { classname } from '@utils/classname';
import { isFileImage } from '@utils/files';

import './chat-message-content.scss';

const cn = classname('chat-message-content');

export const ChatMessageContent = ({
    systemMessagePayload,
    creator,
    content,
    attachments,
    systemMessageType,
}: Pick<ChatMessageType, 'systemMessagePayload' | 'creator' | 'content' | 'attachments' | 'systemMessageType'>) => {
    const preparedContent = useMessageContent({
        content,
        creator,
        systemMessageType,
        systemMessagePayload,
    });

    const images = attachments?.filter(file => isFileImage(file.url));
    const otherFiles = attachments?.filter(file => !isFileImage(file.url));

    return (
        <div className={cn()}>
            {preparedContent}
            {images && images?.length > 0 && (
                <ImageProvider>
                    {images.map(({ publicId, name, url }) => (
                        <ImageView key={publicId} src={url} alt={name} className={cn('photo')} />
                    ))}
                </ImageProvider>
            )}
            {otherFiles && otherFiles?.length > 0 && (
                <>
                    {otherFiles.map(({ publicId, name, url, size }) => (
                        <a key={publicId} href={url} target='_blank' rel='noreferrer'>
                            {name} ({convertBytesToMB(size)} Mb)
                        </a>
                    ))}
                </>
            )}
        </div>
    );
};
