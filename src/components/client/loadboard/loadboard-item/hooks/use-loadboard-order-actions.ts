import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@store';
import loadboardApi from '@store/api/loadboard-api';
import { OrderOffer } from '@store/common/orders/types';
import { useCreateOrderFlagMutation, useDeleteOrderFlagMutation } from '@store/api/orders-api';
import { loadboardActions } from '@store/client/loadboard/slice';
import { translateByNamespace } from '@utils/i18n';

import { OfferTabsEnum } from '../../../offers/offer-drawer/offer-drawer';
import { LoadboardItemProps } from '../loadboard-item.types';

import { useCancelRequest } from './use-cancel-request';
import { useSendRequestAction } from './use-send-request-action';

const t = translateByNamespace('client:loadboard:item');
const translateOrder = translateByNamespace('client:order');

export const useLoadboardItemActions = ({ order, loadBoardFilters }: Omit<LoadboardItemProps, 'tagged'>) => {
    const { publicId: orderPublicId, latestRequest, driverRequests } = order;
    const dispatch = useAppDispatch();
    const { sendRequest, isMeDriver } = useSendRequestAction(order);
    const { handleCancelRequest: handleCancelLatestRequest } = useCancelRequest({ publicOrderId: orderPublicId, publicRequestId: latestRequest?.publicId });

    const publicRequestId = driverRequests && driverRequests.length > 0 ? driverRequests[0]?.publicId : undefined;
    const { handleCancelRequest: handleCancelDriverRequest } = useCancelRequest({ publicOrderId: orderPublicId, publicRequestId });

    const viewDetails = useCallback(
        (title = t('request-info')) => {
            dispatch(
                loadboardActions.setRequestDrawer({
                    opened: true,
                    order: order,
                    title,
                    reverse: true,
                }),
            );
        },
        [dispatch, order],
    );

    const [createOrderFlag] = useCreateOrderFlagMutation();
    const [deleteOrderFlag] = useDeleteOrderFlagMutation();

    const handleMarkOrderAsFlaggedClick = useCallback(async () => {
        try {
            await createOrderFlag({ publicOrderId: orderPublicId }).unwrap();
            dispatch(
                loadboardApi.util.updateQueryData('getLoadboardItems', { filters: loadBoardFilters }, items => {
                    items.data = items.data.map(item => {
                        if (item.publicId === orderPublicId) {
                            return {
                                ...item,
                                isFlagged: true,
                            };
                        }

                        return item;
                    });
                }),
            );

            toast.success(translateOrder<string>('flagged-order-success-notification'));
        } catch {
            toast.error(translateOrder<string>('update-error-notification'));
        }
    }, [createOrderFlag, orderPublicId, dispatch, loadBoardFilters]);

    const handleMarkOrderAsUnFlaggedClick = useCallback(async () => {
        try {
            await deleteOrderFlag({ publicOrderId: orderPublicId }).unwrap();

            dispatch(
                loadboardApi.util.updateQueryData('getLoadboardItems', { filters: loadBoardFilters }, items => {
                    items.data = items.data.filter(item => {
                        if (item.publicId === orderPublicId) {
                            if (loadBoardFilters?.hasFlags === 1) {
                                return false;
                            } else {
                                item.isFlagged = false;
                            }
                        }

                        return true;
                    });
                }),
            );

            toast.success(translateOrder<string>('unflagged-order-success-notification'));
        } catch {
            toast.error(translateOrder<string>('update-error-notification'));
        }
    }, [deleteOrderFlag, orderPublicId, dispatch, loadBoardFilters]);

    const router = useRouter();

    const handleViewOrder = useCallback(
        (orderId: string) => {
            router.push(`orders/${orderId}`);
        },
        [router],
    );

    const handleViewOffer = useCallback(
        async (offer: OrderOffer) => {
            const query = router.query;

            await router.push({
                query: {
                    ...query,
                    drawerOfferId: offer.publicId,
                    drawerTab: OfferTabsEnum.details,
                },
            });
        },
        [router],
    );

    return {
        sendRequest,
        handleMarkOrderAsFlaggedClick,
        handleMarkOrderAsUnFlaggedClick,
        viewDetails,
        handleCancelLatestRequest,
        handleCancelDriverRequest,
        handleViewOffer,
        handleViewOrder,
        isMeDriver,
    };
};
