import React, { useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'debounce';

import { ChatTypesEnum } from '@/enums';
import { useTimeoutManager } from '@/hooks/use-timeout-manager';
import { AttachIcon, SendMessageIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { chatExternalNumberSelector, sendMessageAction } from '@store/common';
import { ChatShortInfo } from '@store/common/chats/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { ChatProps } from '../chat.types';

import './chat-controls.scss';

type ChatControlsProps = Pick<ChatProps, 'chatId' | 'externalPhone'> & {
    chatType: ChatTypesEnum | null;
    callback: () => void;
    fetchPhoneChatDetails: () => Promise<ChatShortInfo | null>;
};

const t = translateByNamespace('common:chats');

const cn = classname('chat-controls');

const DEFAULT_TEXT_AREA_HEIGHT = 40;

export const ChatControls = ({ chatId, externalPhone, chatType, fetchPhoneChatDetails, callback }: ChatControlsProps) => {
    const dispatch = useAppDispatch();
    const [newMessageText, setNewMessageText] = useState<string>();
    const [textareaHeight, setTextareaHeight] = useState(DEFAULT_TEXT_AREA_HEIGHT);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;

        if (value) {
            setTextareaHeight(event.target.scrollHeight);
        } else {
            setTextareaHeight(DEFAULT_TEXT_AREA_HEIGHT);
        }

        setNewMessageText(value);
    }, []);

    const phone = useAppSelector(chatExternalNumberSelector(chatId));

    const setTimer = useTimeoutManager();

    const sendMessageDebounced = useMemo(
        () =>
            debounce(async () => {
                let currentChatId: string | null = chatId;
                let currentChatType: ChatTypesEnum | null = chatType;

                if (!currentChatId) {
                    const chat = await fetchPhoneChatDetails();

                    currentChatId = chat?.publicId ?? null;
                    currentChatType = chat?.type ?? null;

                    if (!currentChatId) {
                        return;
                    }
                }

                if (!newMessageText || newMessageText.trim() === '') {
                    return;
                }

                dispatch(
                    sendMessageAction({
                        chatId: currentChatId,
                        content: newMessageText,
                        ...(currentChatType === ChatTypesEnum.BETWEEN_PHONES ? { type: 'outgoing_sms' } : undefined),
                    }),
                ).then(() => {
                    setNewMessageText('');
                    setTextareaHeight(DEFAULT_TEXT_AREA_HEIGHT);

                    setTimer(`send-message-${currentChatId}`, () => callback(), 1000);
                });
            }, 300),
        [chatId, chatType, newMessageText, dispatch, fetchPhoneChatDetails, setTimer, callback],
    );

    const onKeyDownHandler = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !!newMessageText) {
                event.preventDefault();
                event.stopPropagation();
                sendMessageDebounced();
            }
        },
        [newMessageText, sendMessageDebounced],
    );

    const onSelectFilesHandler = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;

            if (!files) {
                return;
            }

            let currentChatId: string | null = chatId;
            let currentChatType: ChatTypesEnum | null = chatType;

            if (!currentChatId) {
                const chat = await fetchPhoneChatDetails();

                currentChatId = chat?.publicId ?? null;
                currentChatType = chat?.type ?? null;

                if (!currentChatId) {
                    return;
                }
            }

            dispatch(
                sendMessageAction({
                    chatId: currentChatId,
                    files,
                    ...(currentChatType === ChatTypesEnum.BETWEEN_PHONES ? { type: 'outgoing_sms' } : undefined),
                }),
            )
                .then(() => {
                    setTimer(`send-files-${currentChatId}`, () => callback(), 1000);
                })
                .finally(() => {
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                });
        },
        [chatId, chatType, dispatch, fetchPhoneChatDetails, setTimer, callback],
    );

    const textareaPlaceholder = useMemo(() => {
        if (externalPhone) {
            return t('sms-textarea-placeholder', { phone: formatInternationalPhoneNumber(externalPhone) });
        }

        if (chatType === ChatTypesEnum.BETWEEN_PHONES && phone) {
            return t('sms-textarea-placeholder', { phone: formatInternationalPhoneNumber(phone) });
        }

        return t('textarea-placeholder');
    }, [phone, chatType, externalPhone]);

    return (
        <div className={cn('')}>
            <button className={cn('attach')}>
                <AttachIcon onClick={() => fileInputRef?.current?.click()} />
                <input type='file' ref={fileInputRef} onChange={onSelectFilesHandler} multiple={false} />
            </button>
            <textarea
                className={cn('message-text')}
                value={newMessageText}
                onChange={onChangeHandler}
                style={{ height: textareaHeight + 'px' }}
                placeholder={textareaPlaceholder}
                onKeyDown={onKeyDownHandler}
            />
            <button className={cn('send-message')} onClick={sendMessageDebounced}>
                <SendMessageIcon />
            </button>
        </div>
    );
};
