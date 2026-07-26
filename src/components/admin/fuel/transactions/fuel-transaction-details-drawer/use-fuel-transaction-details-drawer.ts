import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { fuelActions, fuelTransactionDetailsDrawerPropsSelector } from '@store/admin';

export const useFuelTransactionDetailsDrawer = () => {
    const { fuelTransaction, isPopupOpened } = useAppSelector(fuelTransactionDetailsDrawerPropsSelector);

    const dispatch = useAppDispatch();

    const handleCloseDraw3er = useCallback(
        () => dispatch(fuelActions.setFuelTransactionDetailsDrawerProps({ isPopupOpened: false, fuelTransaction: null })),
        [dispatch],
    );

    return {
        isPopupOpened,
        fuelTransaction,
        handleCloseDraw3er,
    };
};
