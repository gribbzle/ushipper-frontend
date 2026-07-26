import React, { useCallback, useMemo, useRef, useState } from 'react';
import { debounce } from 'debounce';

import { ChatTypesEnum } from '@/enums';
import { useTimeoutManager } from '@hooks';
import { AttachIcon, SendFilledIcon } from '@icons';
import { useAppDispatch } from '@store';
import { sendMessageAction } from '@store/common';
import { classname, formatInternationalPhoneNumber, translateByNamespace } from '@utils';

import './message-controls.scss';

type MessageControlsProps = {
    externalPhone?: string | null;
    chatType: ChatTypesEnum;
    chatId: string;
    callback: () => void;
};

const t = translateByNamespace('common:chats');
const cn = classname('message-controls');

const DEFAULT_TEXT_AREA_HEIGHT = 24;
const MAX_TEXT_AREA_HEIGHT = 80;

export const MessageControls = ({ chatId, chatType, externalPhone, callback }: MessageControlsProps) => {
    const dispatch = useAppDispatch();
    const [newMessageText, setNewMessageText] = useState<string>();
    const [textareaHeight, setTextareaHeight] = useState(DEFAULT_TEXT_AREA_HEIGHT);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const changeTextareaHeight = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = `${DEFAULT_TEXT_AREA_HEIGHT}px`;
            const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_TEXT_AREA_HEIGHT);

            setTextareaHeight(newHeight);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, []);

    const onChangeHandler = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value;

            if (value) {
                changeTextareaHeight();
            } else {
                setTextareaHeight(DEFAULT_TEXT_AREA_HEIGHT);
            }

            setNewMessageText(value);
        },
        [changeTextareaHeight],
    );

    const setTimer = useTimeoutManager();

    const sendMessageDebounced = useMemo(
        () =>
            debounce(async () => {
                if (!newMessageText || newMessageText.trim() === '') {
                    return;
                }

                dispatch(
                    sendMessageAction({
                        chatId,
                        content: newMessageText,
                        ...(chatType === ChatTypesEnum.BETWEEN_PHONES ? { type: 'outgoing_sms' } : undefined),
                    }),
                ).then(() => {
                    setNewMessageText('');
                    setTextareaHeight(DEFAULT_TEXT_AREA_HEIGHT);

                    setTimer(`send-message-${chatId}`, () => callback(), 1000);
                });
            }, 300),
        [chatId, dispatch, setTimer, newMessageText, chatType, callback],
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

            dispatch(
                sendMessageAction({
                    chatId,
                    files,
                    ...(chatType === ChatTypesEnum.BETWEEN_PHONES ? { type: 'outgoing_sms' } : undefined),
                }),
            )
                .then(() => {
                    setTimer(`send-file-${chatId}`, () => callback(), 1000);
                })
                .finally(() => {
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                });
        },
        [chatId, dispatch, chatType, setTimer, callback],
    );

    const textareaPlaceholder = useMemo(() => {
        if (externalPhone && chatType === ChatTypesEnum.BETWEEN_PHONES) {
            return t('sms-textarea-placeholder', { phone: formatInternationalPhoneNumber(externalPhone) });
        }

        return t('write-textarea-placeholder');
    }, [chatType, externalPhone]);

    return (
        <div className={cn('wrapper')}>
            <div className={cn('')}>
                <textarea
                    ref={textareaRef}
                    className={cn('textarea')}
                    value={newMessageText}
                    onChange={onChangeHandler}
                    style={{
                        height: `${textareaHeight}px`,
                        overflowY: textareaHeight >= MAX_TEXT_AREA_HEIGHT ? 'auto' : 'hidden',
                    }}
                    placeholder={textareaPlaceholder}
                    onKeyDown={onKeyDownHandler}
                />
                <div className={cn('actions')}>
                    <div>
                        <button className={cn('attach')}>
                            <AttachIcon onClick={() => fileInputRef?.current?.click()} />
                            <input type='file' ref={fileInputRef} onChange={onSelectFilesHandler} multiple={false} />
                        </button>
                    </div>
                    <button className={cn('send-message')} onClick={sendMessageDebounced}>
                        <SendFilledIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};
