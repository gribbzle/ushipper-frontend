import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { FormControl, TextField } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { messagesActions, sendMessageRequestStatusSelector, updateChatMessagePopupPropsSelector, updateMessageAction } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { required } from '@validators';

const t = translateByNamespace('common:messages-page:update-chat-message-popup');
const tNotification = translateByNamespace('common:chats');

export type UpdateChatMessageFormState = {
    content: string;
};

export const UpdateChatMessagePopup = () => {
    const { isPopupOpened, chatId, messagePublicId, content } = useAppSelector(updateChatMessagePopupPropsSelector);
    const isUpdatingMessage = useAppSelector(sendMessageRequestStatusSelector(chatId));

    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<UpdateChatMessageFormState>>();

    const onCloseHandler = useCallback(() => {
        dispatch(messagesActions.setUpdateChatMessagePopupProps({ isPopupOpened: false, chatId: null, messagePublicId: null, content: null }));
    }, [dispatch]);

    const handleSubmit = useCallback(
        async ({ content }: UpdateChatMessageFormState) => {
            if (!chatId || !messagePublicId) {
                toast.error(tNotification<string>('update-message-error'));

                return;
            }

            try {
                await dispatch(
                    updateMessageAction({
                        chatId,
                        messagePublicId,
                        content,
                    }),
                );
                onCloseHandler();
            } catch {
                toast.error(tNotification<string>('update-message-error'));
            }
        },
        [chatId, dispatch, onCloseHandler, messagePublicId],
    );

    const handleUpdateMessageClick = useCallback(() => formRef.current?.submit(), []);

    const actions = useMemo(
        () => (
            <>
                <Button view='primary' size='small' onClick={handleUpdateMessageClick} hasLoader={isUpdatingMessage === RequestStatus.PROCESSING}>
                    {t('update-message')}
                </Button>
                <Button view='default' size='small' onClick={onCloseHandler}>
                    {t('close-popup')}
                </Button>
            </>
        ),
        [onCloseHandler, handleUpdateMessageClick, isUpdatingMessage],
    );

    const initialValues = useMemo(() => {
        return { content: content ?? '' };
    }, [content]);

    const description = useMemo(
        () => (
            <Form<UpdateChatMessageFormState>
                initialValues={initialValues}
                onSubmit={handleSubmit}
                render={({ form, handleSubmit }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <Field
                                    name='content'
                                    component={TextField}
                                    multiline={true}
                                    resize='none'
                                    validate={required}
                                    parse={value => value}
                                    placeholder=''
                                />
                            </FormControl>
                        </form>
                    );
                }}
            />
        ),
        [initialValues, handleSubmit],
    );

    return <Popup isOpen={isPopupOpened} description={description} onClose={onCloseHandler} title={t('title')} actions={actions} />;
};
