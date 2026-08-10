import { MouseEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useCheckingContractPopup } from '@/components/client/loadboard/checking-contract-popup/use-checking-contract-popup';
import { useParsedOrderSettingsError } from '@/hooks/loadboard/use-parsed-order-settings-error';
import { useAppDispatch } from '@store';
import { useLazyGetExternalOrdersQuery } from '@store/api/external-orders-api';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';
import { loadboardActions, ParsedOrderData } from '@store/client/loadboard';
import { translateByNamespace } from '@utils/i18n';

import { formattedParsedOrder } from './utils';

const tNotification = translateByNamespace('client:loadboard:notifications');
const tCheckContract = translateByNamespace('client:loadboard:checking-contract-popup');

export type CustomCheckContractError = {
    status: number;
    data: {
        data: {
            data: ParsedOrderData[];
        };
        message?: string;
    };
};

export const useHandleCheckContract = (order: Load, loadBoardFilters: LoadBoardFilters) => {
    const { publicId, details } = order;
    const parsedOrderSettingsError = useParsedOrderSettingsError({ publicOrderId: publicId });

    const dispatch = useAppDispatch();

    const [getExternalOrders] = useLazyGetExternalOrdersQuery();

    const { handleClosePopup } = useCheckingContractPopup(loadBoardFilters);

    const handleCheckContract = useCallback(
        async (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            try {
                dispatch(
                    loadboardActions.setCheckingContractPopup({
                        opened: true,
                        orderId: details.orderId,
                        publicOrderId: publicId,
                        isChecking: false,
                        message: null,
                    }),
                );
                const order = await getExternalOrders(publicId).unwrap();

                dispatch(
                    loadboardActions.setCheckingContractPopup({
                        opened: true,
                        parsedOrders: [order],
                        orderId: details.orderId,
                        publicOrderId: publicId,
                        isChecking: true,
                        isSuccess: true,
                    }),
                );
            } catch (err) {
                const error = err as CustomCheckContractError;

                switch (error.status) {
                    case 404: {
                        const parsedOrders = error.data.data.data ?? [];
                        const convertedOrders = parsedOrders.length > 0 ? parsedOrders.map(formattedParsedOrder) : null;

                        dispatch(
                            loadboardActions.setCheckingContractPopup({
                                opened: true,
                                parsedOrders: convertedOrders,
                                orderId: details.orderId,
                                publicOrderId: publicId,
                                isChecking: true,
                                message: parsedOrders.length > 0 ? null : tCheckContract('empty-result'),
                            }),
                        );

                        return;
                    }
                    case 403:
                        parsedOrderSettingsError({ error: error.data.message, defaultMessage: tNotification('check-contract-error-notification') });

                        return;
                    default:
                        await handleClosePopup();
                        toast.error<string>(tNotification('check-contract-error-notification'));
                        break;
                }
            }
        },
        [dispatch, details.orderId, publicId, getExternalOrders, handleClosePopup, parsedOrderSettingsError],
    );

    return handleCheckContract;
};
