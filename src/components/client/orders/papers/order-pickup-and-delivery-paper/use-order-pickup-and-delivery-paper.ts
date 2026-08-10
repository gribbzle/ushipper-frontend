import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { useChatId } from '@/hooks/chat/use-chat-id';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDrivingDistanceSelector, ordersActions } from '@store/client';
import { chatUnreadMessagesSelector } from '@store/common';

export const useOrderPickupAndDeliveryPaper = () => {
    const dispatch = useAppDispatch();
    const drivingDistance = useAppSelector(orderDrivingDistanceSelector);
    const chatId = useChatId();
    const unreadMessages = useAppSelector(chatUnreadMessagesSelector(chatId));
    const router = useRouter();
    const orderId = router.query['order-id'] as string;

    const handleOpenOrderChatDrawer = useCallback(() => {
        dispatch(ordersActions.setOrderChatDrawerProps({ isVisible: true, orderPublicId: orderId }));
    }, [dispatch, orderId]);

    const badgeText = useMemo(() => (unreadMessages.length > 0 ? unreadMessages.length.toString() : undefined), [unreadMessages.length]);

    return { drivingDistance, chatId, handleOpenOrderChatDrawer, badgeText };
};
