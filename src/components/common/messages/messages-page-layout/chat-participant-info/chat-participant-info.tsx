import React from 'react';

import { useAppSelector } from '@store';
import { chatInfoSelector } from '@store/client';
import { classname } from '@utils';

import { ParticipantContactInfo } from './participant-contact-info';
import { ParticipantOrdersInfo } from './participant-orders-info';
import { ParticipantProfileHeader } from './participant-profile-header';

import './chat-participant-info.scss';

const cn = classname('chat-participant-info');

export const ChatParticipantInfo = ({ chatId }: { chatId: string | null }) => {
    const chatInfo = useAppSelector(chatInfoSelector(chatId));

    const { account, user } = chatInfo || {};

    if (!account || !user) {
        return null;
    }

    return (
        <div className={cn('')}>
            <ParticipantProfileHeader account={account} user={user} />
            <ParticipantContactInfo account={account} />
            <ParticipantOrdersInfo accountId={account.publicId} />
        </div>
    );
};
