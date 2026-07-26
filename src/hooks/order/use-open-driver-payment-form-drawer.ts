import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { OrderDriverPaymentFormDrawerDrawerState, ordersActions } from '@store/client';

export const useOpenDriverPaymentFormDrawer = () => {
    const dispatch = useAppDispatch();

    return useCallback(
        ({ orderId, instantTermPaymentType, instantTermPaymentMethod, attachment }: Omit<OrderDriverPaymentFormDrawerDrawerState, 'isVisible'>) => {
            dispatch(
                ordersActions.setDriverPaymentFormDrawerProps({
                    isVisible: true,
                    orderId,
                    attachment: attachment ?? null,
                    instantTermPaymentType: instantTermPaymentType ?? null,
                    instantTermPaymentMethod,
                }),
            );
        },
        [dispatch],
    );
};
