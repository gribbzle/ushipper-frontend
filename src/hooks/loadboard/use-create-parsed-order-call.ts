import { useCallback } from 'react';

import { UserOrderStatus } from '@/enums/user-order-status-enum';
import { useAppDispatch } from '@store';
import { loadboardApi } from '@store/api/loadboard-api';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { useCreateOrderCallMutation } from '@store/api/orders-api';

export const useCreateParsedOrderCall = () => {
    const dispatch = useAppDispatch();
    const [createOrderCall] = useCreateOrderCallMutation();

    const createParsedOrderCall = useCallback(
        async (publicOrderId: string, loadBoardFilters?: LoadBoardFilters) => {
            await createOrderCall({ publicOrderId }).unwrap();

            if (loadBoardFilters) {
                dispatch(
                    loadboardApi.util.updateQueryData('getLoadboardItems', { filters: loadBoardFilters }, items => {
                        items.data = items.data.map(item => {
                            if (item.publicId === publicOrderId) {
                                return {
                                    ...item,
                                    userOrderStatus: UserOrderStatus.CALLED,
                                };
                            }

                            return item;
                        });
                    }),
                );
            }
        },
        [dispatch, createOrderCall],
    );

    return createParsedOrderCall;
};
