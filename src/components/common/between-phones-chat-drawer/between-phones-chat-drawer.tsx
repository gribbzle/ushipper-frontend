import React from 'react';

import { Chat } from '@/components/common/chats-drawer/chat';
import { Drawer } from '@/components/common/drawer/drawer';
import { classname } from '@utils/classname';
import { formatInternationalPhoneNumber } from '@utils/phone';

import { useBetweenPhonesChatDrawer } from './use-between-phones-chat-drawer';

import './between-phones-chat-drawer.scss';

const cn = classname('between-phones-chat-drawer');

export const BetweenPhonesChatDrawer = () => {
    const { onAfterSubmitMessage, handleClose, isVisible, externalNumber, selectedChatId } = useBetweenPhonesChatDrawer();

    if (!externalNumber) {
        return null;
    }

    return (
        <Drawer
            isOpen={isVisible}
            onClose={handleClose}
            head={formatInternationalPhoneNumber(externalNumber)}
            body={<Chat externalPhone={externalNumber} chatId={selectedChatId} mode='order-page' callback={value => onAfterSubmitMessage(value)} />}
            className={cn()}
        />
    );
};
