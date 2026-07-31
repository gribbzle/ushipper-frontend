import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { OrderStatus } from '@/enums';
import useOrderOptionsHandlers from '@/hooks/order/use-order-options-handlers';
import useOrderValidation from '@/hooks/order/use-order-validation';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { useAppDispatch } from '@store';
import { useLazyGetOrderBolQuery } from '@store/api/order-bol-api';
import { useCancelOfferMutation } from '@store/api/order-offers';
import { ordersApi, usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { Load, ordersActions } from '@store/client';
import { downloadFileUsingAnchorElement } from '@utils/files';
import { translateByNamespace } from '@utils/i18n';

const translateActions = translateByNamespace('client:order-actions');

export const useShipperOrderActions = (order: Load, isOrderItemContext?: boolean) => {
    const router = useRouter();

    const { handleEditOrderClick } = useOrderOptionsHandlers(order, isOrderItemContext);

    const [validationPopupOpen, setValidationPopupOpen] = useState(false);
    const onCloseValidationPopup = useCallback(() => {
        setValidationPopupOpen(false);
    }, []);

    const { errors } = useOrderValidation(order);

    const dispatch = useAppDispatch();
    const openOfferDrawer = useCallback(() => {
        if (errors.length) {
            setValidationPopupOpen(true);
        } else {
            dispatch(
                ordersActions.setOrderSendOfferToCarrierDrawerProps({
                    isVisible: true,
                    orderId: order.publicId,
                    order: order,
                }),
            );
        }
    }, [dispatch, order, errors]);

    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const postToLoadBoard = useCallback(() => {
        if (errors.length) {
            setValidationPopupOpen(true);
        } else {
            partiallyUpdateOrder({
                publicOrderId: order.publicId,
                newOrderData: {
                    status: OrderStatus.POSTED,
                },
            })
                .unwrap()
                .then(() => {
                    if (!isOrderItemContext) {
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: order.publicId }]));
                    }
                    toast.success(translateActions<string>('success-post-to-loadboard'));
                })
                .catch(error => {
                    parseAndShowAxiosError(error);
                });
        }
    }, [partiallyUpdateOrder, order.publicId, errors, isOrderItemContext, dispatch]);

    const upPostFromLoadBoard = useCallback(() => {
        partiallyUpdateOrder({
            publicOrderId: order.publicId,
            newOrderData: {
                status: OrderStatus.NEW,
            },
        })
            .unwrap()
            .then(() => {
                if (!isOrderItemContext) {
                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: order.publicId }]));
                }
                toast.success(translateActions<string>('success-unpost-to-loadboard'));
            });
    }, [dispatch, partiallyUpdateOrder, order.publicId, isOrderItemContext]);

    const openRequestsDrawer = useCallback(async () => {
        await router.push({
            query: {
                ...router.query,
                requestsOrderId: order.publicId,
            },
        });
    }, [order.publicId, router]);

    const [cancelOffer] = useCancelOfferMutation();
    const cancelOfferHandler = async () => {
        if (order.latestOffer) {
            await cancelOffer(order.latestOffer?.publicId)
                .unwrap()
                .then(() => {
                    toast.success(translateActions<string>('offer-canceled-success'));

                    if (!isOrderItemContext) {
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: order.publicId }]));
                    }

                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }]));
                })
                .catch(e => {
                    let message = translateActions('offer-canceled-error');

                    if (e.data.message) {
                        message = e.data.message as string;
                    }
                    toast.error(message);
                });
        }
    };

    const handleRestoreClick = useCallback(() => {
        dispatch(ordersActions.setRestoreOrderPopupProps({ isVisible: true, publicOrderId: order.publicId }));
    }, [dispatch, order.publicId]);

    const [getBol] = useLazyGetOrderBolQuery();
    const downloadBol = useCallback(() => {
        if (order.publicId) {
            getBol({
                orderId: order.publicId,
            })
                .unwrap()
                .then(res => {
                    if (res.attachment.url) {
                        downloadFileUsingAnchorElement({
                            url: res.attachment.url,
                            filename: `The order ${order.publicId} BOL`,
                        });
                    }
                    console.log(res);
                })
                .catch(e => {
                    parseAndShowAxiosError(e);
                });
        }
    }, [order.publicId, getBol]);

    return {
        handleEditOrderClick,
        handleRestoreClick,
        cancelOfferHandler,
        openRequestsDrawer,
        upPostFromLoadBoard,
        postToLoadBoard,
        openOfferDrawer,
        onCloseValidationPopup,
        downloadBol,
        validationPopupOpen,
        errors,
    };
};
