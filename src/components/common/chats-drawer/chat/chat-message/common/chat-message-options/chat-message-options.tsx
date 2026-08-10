import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/common/button';
import { useAppDispatch, useAppSelector } from '@store';
import { deleteMessageRequestStatusSelector, messagesActions, sendMessageRequestStatusSelector } from '@store/common';
import { classname } from '@utils/classname';
import { RequestStatus } from '@utils/redux';

import './chat-message-options.scss';
import PencilWithLineIcon from '@/assets/icons/pencil-with-line.svg';
import TrashIcon from '@/assets/icons/trash-can.svg';

const DEFAULT_OFFSET = 10;

const cn = classname('chat-message-options');

type ChatMessageOptionsProps = {
    isOpen: boolean;
    hideUpdateOption: boolean;
    contentRef: RefObject<HTMLDivElement> | null;
    messagePublicId: string;
    messageContent?: string;
    chatId: string | null;
};

export const ChatMessageOptions = ({ contentRef, isOpen, hideUpdateOption, messagePublicId, chatId, messageContent }: ChatMessageOptionsProps) => {
    const [targetHeight, setTargetHeight] = useState<number>(0);
    const dispatch = useAppDispatch();
    const isDeletingMessage = useAppSelector(deleteMessageRequestStatusSelector(chatId));
    const isUpdatingMessage = useAppSelector(sendMessageRequestStatusSelector(chatId));

    const updateHeight = useCallback(() => {
        if (contentRef?.current) {
            setTargetHeight(contentRef.current.offsetHeight);
        }
    }, [contentRef]);

    useEffect(() => {
        updateHeight();

        if (contentRef?.current) {
            const images = contentRef.current.querySelectorAll('img');

            images.forEach(img => {
                if (!img.complete) {
                    img.onload = updateHeight;
                }
            });
        }
    }, [contentRef, updateHeight]);

    const bottomHeight = useMemo(() => targetHeight - DEFAULT_OFFSET, [targetHeight]);

    const onDeleteMessageHandler = useCallback(() => {
        dispatch(messagesActions.setDeleteChatMessagePopupProps({ isPopupOpened: true, chatId, messagePublicId }));
    }, [dispatch, chatId, messagePublicId]);

    const onUpdateMessageHandler = useCallback(() => {
        dispatch(messagesActions.setUpdateChatMessagePopupProps({ isPopupOpened: true, chatId, messagePublicId, content: messageContent ?? '' }));
    }, [dispatch, chatId, messagePublicId, messageContent]);

    return (
        <div className={cn('', { open: isOpen })} style={{ bottom: bottomHeight }}>
            {!hideUpdateOption && (
                <Button size='mini' onClick={onUpdateMessageHandler} disabled={isUpdatingMessage === RequestStatus.PROCESSING}>
                    <PencilWithLineIcon />
                </Button>
            )}
            <Button size='mini' onClick={onDeleteMessageHandler} disabled={isDeletingMessage === RequestStatus.PROCESSING}>
                <TrashIcon />
            </Button>
        </div>
    );
};
