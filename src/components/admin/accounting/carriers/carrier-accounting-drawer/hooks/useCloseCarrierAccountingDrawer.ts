import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';

export const useCloseCarrierAccountingDrawer = () => {
    const dispatch = useAppDispatch();

    const handleClose = useCallback(() => {
        dispatch(
            accountingActions.setCarrierAccountingDrawerProps({
                isDrawerOpened: false,
                title: null,
                companyId: null,
                isPartner: false,
                selectedTab: null,
                enablePaymentSystem: false,
            }),
        );
    }, [dispatch]);

    return handleClose;
};
