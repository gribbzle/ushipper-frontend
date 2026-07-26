import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { isChatInitiazedSelector, openChatByJobOfferIdAction } from '@store/common';

export const useJobOfferChat = (jobOfferPublicId?: string) => {
    const dispatch = useAppDispatch();
    const [chatId, setChatId] = useState<string | null>(null);

    useEffect(() => {
        if (jobOfferPublicId) {
            dispatch(openChatByJobOfferIdAction(jobOfferPublicId)).then(data => {
                const newChatId = data.payload as string | null;

                if (newChatId) {
                    setChatId(newChatId);
                }
            });
        }
    }, [jobOfferPublicId, dispatch]);

    const isChatInitialized = useAppSelector(isChatInitiazedSelector(chatId));

    return { isChatInitialized, chatId };
};
