import React from 'react';
import { useSelector } from 'react-redux';

import { Chat } from '@/components/common/chats-drawer/chat';
import { useChatId } from '@hooks';
import { isChatInitiazedSelector } from '@store/common';

export const OrderChat = () => {
    const chatId = useChatId();
    const isChatInitiazed = useSelector(isChatInitiazedSelector(chatId));

    if (!chatId) {
        return null;
    }

    return <Chat chatId={chatId} mode='order-page' isNeedInitialize={!isChatInitiazed} />;
};
