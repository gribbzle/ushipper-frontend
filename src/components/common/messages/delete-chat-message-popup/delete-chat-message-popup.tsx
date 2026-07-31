import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { useAppDispatch, useAppSelector } from '@store';
import { deleteChatMessagePopupPropsSelector, deleteMessageAction, deleteMessageRequestStatusSelector, messagesActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { renderTextWithBreakLines } from '@utils/render';

const t = translateByNamespace('common:messages-page:delete-chat-message-popup');
const tNotification = translateByNamespace('common:chats');

export const DeleteChatMessagePopup = () => {
    const { isPopupOpened, chatId, messagePublicId } = useAppSelector(deleteChatMessagePopupPropsSelector);
    const isDeletingMessage = useAppSelector(deleteMessageRequestStatusSelector(chatId));

    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(messagesActions.setDeleteChatMessagePopupProps({ isPopupOpened: false, chatId: null, messagePublicId: null }));
    }, [dispatch]);

    const deleteMessageHandler = useCallback(async () => {
        if (!chatId || !messagePublicId) {
            toast.error(tNotification<string>('delete-message-error'));

            return;
        }

        try {
            await dispatch(
                deleteMessageAction({
                    chatId,
                    messagePublicId,
                }),
            );
            onCloseHandler();
        } catch (error) {
            toast.error(tNotification<string>('delete-message-error'));
        }
    }, [chatId, dispatch, onCloseHandler, messagePublicId]);

    const actions = useMemo(
        () => (
            <>
                <Button view='danger' size='small' onClick={deleteMessageHandler} hasLoader={isDeletingMessage === RequestStatus.PROCESSING}>
                    {t('delete-message')}
                </Button>
                <Button view='default' size='small' onClick={onCloseHandler}>
                    {t('close-popup')}
                </Button>
            </>
        ),
        [onCloseHandler, deleteMessageHandler, isDeletingMessage],
    );

    return <Popup isOpen={isPopupOpened} onClose={onCloseHandler} title={renderTextWithBreakLines(t('title'))} actions={actions} />;
};
