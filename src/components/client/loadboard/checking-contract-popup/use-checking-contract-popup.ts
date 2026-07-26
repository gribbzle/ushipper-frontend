import { useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import loadboardApi, { LoadBoardFilters } from '@store/api/loadboard-api';
import { checkingContractPopupSelector } from '@store/client/loadboard';
import { loadboardActions } from '@store/client/loadboard/slice';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:loadboard:checking-contract-popup');

export const useCheckingContractPopup = (loadBoardFilters: LoadBoardFilters) => {
    const dispatch = useAppDispatch();
    const { opened, title, orderId, parsedOrders, message, publicOrderId, isChecking, isSuccess } = useAppSelector(checkingContractPopupSelector);

    const head = useMemo(() => (message && message.includes('settings') ? t('settings-title') : title ?? t('title')), [message, title]);

    const handleClosePopup = useCallback(async () => {
        dispatch(
            loadboardActions.setCheckingContractPopup({
                opened: false,
                title: null,
                parsedOrders: null,
                orderId: null,
                publicOrderId: null,
                isChecking: false,
                message: null,
                assignedDriverId: null,
                externalAssignedDriverId: null,
                isSuccess: false,
                note: null,
            }),
        );
        dispatch(
            loadboardApi.util.updateQueryData('getLoadboardItems', { filters: loadBoardFilters }, items => {
                items.data = items.data.map(item => {
                    if (item.publicId === publicOrderId) {
                        return {
                            ...item,
                            contractCheckedAt: new Date().toISOString(),
                        };
                    }

                    return item;
                });
            }),
        );
    }, [dispatch, loadBoardFilters, publicOrderId]);

    return { head, opened, orderId, parsedOrders, isChecking, message, isSuccess, handleClosePopup };
};
