import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { loadboardActions } from '@store/client/loadboard';
import { getTranslateParsedOrderNotification } from '@utils';

type Props = {
    publicOrderId: string;
    popupTitle?: string;
};

export const useParsedOrderSettingsError = ({ publicOrderId, popupTitle }: Props) => {
    const dispatch = useAppDispatch();

    const parsedOrderSettingsError = useCallback(
        ({ defaultMessage, error }: { defaultMessage: string; error?: string }) => {
            const message = getTranslateParsedOrderNotification({ defaultMessage, error });

            dispatch(
                loadboardActions.setCheckingContractPopup({
                    title: popupTitle ?? null,
                    opened: true,
                    orderId: null,
                    publicOrderId,
                    message,
                    isChecking: true,
                }),
            );
        },
        [dispatch, publicOrderId, popupTitle],
    );

    return parsedOrderSettingsError;
};
