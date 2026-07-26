import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';

export const useHandleSendBOLDrawer = (publicId: string) => {
    const dispatch = useAppDispatch();

    const handleSendBOLDrawerOpen = useCallback(() => {
        dispatch(ordersActions.setSendBOLDrawerProps({ isVisible: true, orderId: publicId }));
    }, [dispatch, publicId]);

    return handleSendBOLDrawerOpen;
};
