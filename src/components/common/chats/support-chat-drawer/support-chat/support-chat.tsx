import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { ChatBlock } from '@/components/common/messages/messages-page-layout/chat-block';
import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, supportChatDrawerPropsSelector } from '@store/common';
import { ChatShortInfo } from '@store/common/chats/types';
import { getSupportChatAction } from '@store/common/messages/actions';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:chats');

export const SupportChat = () => {
    const dispatch = useAppDispatch();
    const { accountId, accountName } = useAppSelector(supportChatDrawerPropsSelector);

    const [chatId, setChatId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSupportChat = async () => {
            if (accountId && accountName) {
                const fetchedSupportChatResponse = await dispatch(getSupportChatAction({ name: accountName, accountId }));

                if (fetchedSupportChatResponse.meta.requestStatus === 'fulfilled') {
                    const chat = fetchedSupportChatResponse.payload as ChatShortInfo;

                    dispatch(chatsActions.prependDrawersChats({ chat, moveAtTop: true }));
                    dispatch(chatsActions.setSelectedChatId(chat.publicId));

                    setChatId(chat.publicId);
                } else {
                    toast.error<string>(t('upload-support-chat-error'));
                }
            }
        };

        fetchSupportChat();
    }, [dispatch, accountId, accountName]);

    if (!chatId) {
        return null;
    }

    return <ChatBlock chatId={chatId} hasBorderRadius={true} mode='drawer' />;
};
