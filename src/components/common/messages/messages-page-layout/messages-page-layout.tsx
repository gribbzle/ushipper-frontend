import React from 'react';

import { ParsedOrderDetailsDrawer } from '@/components/client/loadboard/parsed-order-details-drawer/parsed-order-details-drawer';
import { Paper } from '@/components/common/paper/paper';
import { useMeAdmin } from '@hooks';
import { useAppSelector } from '@store';
import { selectedChatIdSelector } from '@store/client';
import { classname } from '@utils/classname';

import { ChatBlock } from './chat-block';
import { ChatParticipantInfo } from './chat-participant-info';
import { ChatsListBlock } from './chats-list-block';

import './messages-page-layout.scss';

const cn = classname('messages-page-layout');

export const MessagesPageLayout = () => {
    const selectedChatId = useAppSelector(selectedChatIdSelector);
    const isMeAdmin = useMeAdmin();

    return (
        <>
            <Paper
                body={
                    <div className={cn()}>
                        <ChatsListBlock />
                        <ChatBlock chatId={selectedChatId} hasBorderRadius={!isMeAdmin} />

                        {isMeAdmin && <ChatParticipantInfo chatId={selectedChatId} />}
                    </div>
                }
                bodyClassName={cn('content')}
            />
            <ParsedOrderDetailsDrawer />
        </>
    );
};
