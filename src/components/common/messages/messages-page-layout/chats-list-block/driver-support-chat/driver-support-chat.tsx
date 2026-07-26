import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, driverSupportChatSelector } from '@store/client';
import { ChatShortInfo } from '@store/common/chats/types';
import { getSupportChatAction } from '@store/common/messages/actions';

import { ChatListBlockItem } from '../chats-list-block-item';

export const SupportChat = () => {
    const dispatch = useAppDispatch();
    const supportChat = useAppSelector(driverSupportChatSelector);

    const [isSupportChatLoaded, setIsSupportChatLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (!isSupportChatLoaded) {
            const fetchSupportChat = async () => {
                const fetchedSupportChatResponse = await dispatch(getSupportChatAction());

                if (fetchedSupportChatResponse.meta.requestStatus === 'fulfilled') {
                    const chat = fetchedSupportChatResponse.payload as ChatShortInfo;

                    dispatch(chatsActions.setDriverSupportChat(chat));
                    setIsSupportChatLoaded(true);
                }
            };

            fetchSupportChat();
        }
    }, [dispatch, isSupportChatLoaded]);

    if (!supportChat) {
        return null;
    }

    return <ChatListBlockItem chat={supportChat} isDriverSupportChat={true} />;
};
