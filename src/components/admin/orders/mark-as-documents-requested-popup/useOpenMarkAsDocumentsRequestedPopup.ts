import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';

import { MarkAsDocumentsRequestedPopupArgs } from './mark-as-documents-requested-popup.types';

export const useOpenMarkAsDocumentsRequestedPopup = () => {
    const dispatch = useAppDispatch();

    const openPopup = useCallback(
        ({ orderPublicId, orderId }: MarkAsDocumentsRequestedPopupArgs) => {
            dispatch(
                ordersActions.setMarkAsDocumentsRequestedPopupProps({
                    isVisible: true,
                    orderPublicId,
                    orderId,
                }),
            );
        },
        [dispatch],
    );

    return openPopup;
};
