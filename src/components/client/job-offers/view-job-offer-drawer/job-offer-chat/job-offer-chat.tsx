import React from 'react';

import { Chat } from '@/components/common/chats-drawer/chat';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';

import { JobOfferChatProps } from './job-offer-chat.types';
import { useJobOfferChat } from './use-job-offer-chat';

export const JobOfferChat = ({ jobOfferPublicId, jobOffersStatus }: JobOfferChatProps) => {
    const { isChatInitialized, chatId } = useJobOfferChat(jobOfferPublicId);

    if (!chatId) {
        return null;
    }

    return (
        <Chat
            hideControls={[OfferStatusesEnum.DECLINED, OfferStatusesEnum.ACCEPTED].includes(jobOffersStatus)}
            chatId={chatId}
            mode='drawer'
            isNeedInitialize={!isChatInitialized}
        />
    );
};
