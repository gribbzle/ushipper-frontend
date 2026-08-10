import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Chat } from '@/components/common/chats-drawer/chat';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { useAppDispatch } from '@store';
import { isChatInitiazedSelector, openChatByOrderOfferIdAction } from '@store/common';

type Props = {
    offerPublicId?: string;
    offersStatus: OfferStatusesEnum;
};
export const OfferChat = ({ offerPublicId, offersStatus }: Props) => {
    const dispatch = useAppDispatch();
    const [chatId, setChatId] = useState<string | null>(null);

    useEffect(() => {
        if (offerPublicId) {
            dispatch(openChatByOrderOfferIdAction(offerPublicId)).then(data => {
                const newChatId = data.payload as string | null;

                if (newChatId) {
                    setChatId(newChatId);
                }
            });
        }
    }, [offerPublicId, dispatch]);
    const isChatInitiazed = useSelector(isChatInitiazedSelector(chatId));

    if (!chatId) {
        return null;
    }

    return (
        <Chat
            hideControls={[OfferStatusesEnum.DECLINED, OfferStatusesEnum.ACCEPTED].includes(offersStatus)}
            chatId={chatId}
            mode='drawer'
            isNeedInitialize={!isChatInitiazed}
        />
    );
};
