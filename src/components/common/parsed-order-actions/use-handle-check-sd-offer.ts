import { MouseEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useCheckingContractPopup } from '@components';
import { useParsedOrderSettingsError } from '@hooks';
import { useAppDispatch } from '@store';
import { useLazyGetExternalOffersQuery } from '@store/api/external-orders-api';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';
import { loadboardActions } from '@store/client/loadboard';
import { translateByNamespace } from '@utils';

import { CustomCheckContractError } from './use-handle-check-contract';
import { formattedParsedOrder } from './utils';

const tNotification = translateByNamespace('client:loadboard:notifications');
const t = translateByNamespace('client:loadboard:checking-contract-popup');

export const useHandleCheckSDOffer = (order: Load, loadBoardFilters: LoadBoardFilters) => {
    const { publicId, details } = order;
    const parsedOrderSettingsError = useParsedOrderSettingsError({ publicOrderId: publicId, popupTitle: t('checking-offer-title') });

    const dispatch = useAppDispatch();

    const [getExternalOffers] = useLazyGetExternalOffersQuery();

    const { handleClosePopup } = useCheckingContractPopup(loadBoardFilters);

    const handleCheckSDOffer = useCallback(
        async (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            try {
                dispatch(
                    loadboardActions.setCheckingContractPopup({
                        title: t('checking-offer-title'),
                        opened: true,
                        orderId: details.orderId,
                        publicOrderId: publicId,
                        isChecking: false,
                        message: null,
                    }),
                );
                const order = await getExternalOffers(publicId).unwrap();

                dispatch(
                    loadboardActions.setCheckingContractPopup({
                        title: t('checking-offer-title'),
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
                                title: t('checking-offer-title'),
                                opened: true,
                                parsedOrders: convertedOrders,
                                orderId: details.orderId,
                                publicOrderId: publicId,
                                isChecking: true,
                                message: parsedOrders.length > 0 ? null : t('empty-sd-result'),
                            }),
                        );

                        return;
                    }
                    case 403:
                        parsedOrderSettingsError({ error: error.data.message, defaultMessage: tNotification('check-sd-offer-error-notification') });

                        return;
                    default:
                        await handleClosePopup();
                        toast.error<string>(tNotification('check-sd-offer-error-notification'));

                        break;
                }
            }
        },
        [dispatch, details.orderId, publicId, getExternalOffers, handleClosePopup, parsedOrderSettingsError],
    );

    return handleCheckSDOffer;
};
