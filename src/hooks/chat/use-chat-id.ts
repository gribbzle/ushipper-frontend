import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector } from '@store';
import { orderOrderChatDrawerPropsSelector } from '@store/client';
import { openChatByOrderIdAction } from '@store/common';

export const useChatId = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { orderPublicId: orderIdFromState } = useAppSelector(orderOrderChatDrawerPropsSelector);
    const orderId = (router.query['order-id'] as string) || orderIdFromState;

    const [chatId, setChatId] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            dispatch(openChatByOrderIdAction(orderId)).then(data => {
                const fetchedChatId = data.payload as string | null;

                setChatId(fetchedChatId);
            });
        }
    }, [dispatch, orderId]);

    return chatId;
};
