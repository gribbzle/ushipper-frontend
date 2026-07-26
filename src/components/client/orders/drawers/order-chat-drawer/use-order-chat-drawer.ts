import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { useChatId } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDriverSelector, orderOrderChatDrawerPropsSelector, ordersActions, trackingActions } from '@store/client';
import { chatInfoSelector } from '@store/common';

export const useOrderChatDrawer = () => {
    const driver = useAppSelector(orderDriverSelector);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isVisible } = useAppSelector(orderOrderChatDrawerPropsSelector);

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setOrderChatDrawerProps({
                isVisible: false,
                orderPublicId: null,
            }),
        );
    }, [dispatch]);

    const chatId = useChatId();
    const chatInfo = useAppSelector(chatInfoSelector(chatId));

    const openDriverTracking = useCallback(async () => {
        if (driver) {
            dispatch(trackingActions.setSelectedDriverId(driver.publicId));
            if (chatInfo && chatInfo.order) {
                const {
                    order: { orderId },
                } = chatInfo;

                window.open(`${router.basePath}/tracking?orderId=${orderId}`, '_blank');
            }
        }
    }, [driver, dispatch, chatInfo, router.basePath]);

    return { openDriverTracking, handleClose, isVisible, driver };
};
