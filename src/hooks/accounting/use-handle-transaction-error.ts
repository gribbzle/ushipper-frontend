import { useCallback, useEffect } from 'react';
import { AxiosResponse } from 'axios';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { useInitiateAccountPaymentMethodsMutation } from '@store/api/accounts-api';
import { handleError } from '@utils';

type HandleTransactionErrorParams = {
    accountPublicId?: string | null;
    amount: number;
    destinationBalanceId?: string | null;
};

export const useHandleTransactionError = () => {
    const [initiateAccountPaymentMethods, { isLoading }] = useInitiateAccountPaymentMethodsMutation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(accountingActions.setIsCreateTransactionLoading(isLoading));
    }, [isLoading, dispatch]);

    const handleTransactionError = useCallback(
        async (exception: unknown, { accountPublicId, amount, destinationBalanceId }: HandleTransactionErrorParams) => {
            const { data, status } = exception as AxiosResponse<{ data: { error: string } }>;

            if (accountPublicId && destinationBalanceId && status === 400 && data?.data?.error === 'not_enough_data') {
                try {
                    const res = await initiateAccountPaymentMethods({
                        accountPublicId,
                        data: { paymentMethodType: 'masspay', amount, balanceId: destinationBalanceId },
                    }).unwrap();

                    dispatch(
                        accountingActions.setInitiateAccountPaymentMethodsPopupProps({
                            isPopupOpened: true,
                            accountPublicId,
                            data: res,
                            balanceId: destinationBalanceId ?? null,
                        }),
                    );
                } catch (err) {
                    handleError(err);
                }
            } else {
                handleError(exception);
            }
        },
        [initiateAccountPaymentMethods, dispatch],
    );

    return { handleTransactionError };
};
