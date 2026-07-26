import React from 'react';

import { Paper, ParsedOrderDetailsDrawer } from '@components';
import { useMeAdmin } from '@hooks';
import { useAppSelector } from '@store';
import { selectedChatIdSelector } from '@store/client';
import { classname } from '@utils';

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
