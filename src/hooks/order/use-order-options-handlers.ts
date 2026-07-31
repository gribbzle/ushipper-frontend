import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useMeShipper } from '@hooks';
import { useAppDispatch } from '@store';
import { apiSlice } from '@store/api/api-slice';
import {
    OrderVehicleParam,
    useCreateOrderFlagMutation,
    useDeleteOrderFlagMutation,
    useDuplicateOrderMutation,
    usePartiallyUpdateOrderMutation,
} from '@store/api/orders-api';
import { Load, ModeStateEnum, OrderDetails, OrderFormState, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:orders-page:order-options-dropdown');
const translateOrder = translateByNamespace('client:order');

export default function useOrderOptionsHandlers(order: Load, itemsContext?: boolean) {
    const router = useRouter();
    const [duplicateOrder] = useDuplicateOrderMutation();
    const isShipper = useMeShipper();
    const handleDuplicateClick = useCallback(() => {
        const newOrderDetails: OrderDetails = { ...order.details, orderId: `${order.details.orderId || 'None'} (duplicate)` };
        const duplicatedOrderHehicles = [...order.vehicles].map<OrderVehicleParam>(vehicle => {
            return Object.entries(vehicle).reduce<OrderVehicleParam>((acc, currentValue) => {
                const [key, value] = currentValue;

                if (value) {
                    return {
                        ...acc,
                        [key]: value,
                    };
                } else {
                    return acc;
                }
            }, {});
        });

        duplicateOrder({ ...order, details: newOrderDetails, vehicles: duplicatedOrderHehicles })
            .unwrap()
            .then(async ({ publicId }) => {
                const createPath = `/client/orders/${publicId}`;
                const asCreatePath = `/orders/${publicId}`;

                await router.push(createPath, asCreatePath);
            })
            .catch(() => {
                toast.error(t<string>('duplicate-order-error-text'));
            });
    }, [duplicateOrder, order, router]);

    const [createOrderFlag] = useCreateOrderFlagMutation();
    const [deleteOrderFlag] = useDeleteOrderFlagMutation();
    const handleMarkOrderAsFlaggedClick = useCallback(() => {
        createOrderFlag({ publicOrderId: order.publicId })
            .unwrap()
            .then(() => {
                toast.success(translateOrder<string>('flagged-order-success-notification'));
            })
            .catch(() => {
                toast.error(translateOrder<string>('update-error-notification'));
            });
    }, [createOrderFlag, order]);

    const handleMarkOrderAsUnFlaggedClick = useCallback(() => {
        deleteOrderFlag({ publicOrderId: order.publicId })
            .unwrap()
            .then(() => {
                toast.success(translateOrder<string>('unflagged-order-success-notification'));
            })
            .catch(() => {
                toast.error(translateOrder<string>('update-error-notification'));
            });
    }, [deleteOrderFlag, order.publicId]);

    const dispatch = useAppDispatch();
    const handleAddInternalNoteClick = useCallback(() => {
        dispatch(ordersActions.setCreateEditInternalNoteModalProps({ isVisible: true, publicOrderId: order.publicId, mode: ModeStateEnum.CREATE }));
    }, [dispatch, order.publicId]);

    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const updateOrder = useCallback(
        (orderData: OrderFormState, successMessage?: string) => {
            partiallyUpdateOrder({ publicOrderId: order.publicId, newOrderData: orderData })
                .unwrap()
                .then(() => {
                    if (successMessage) {
                        toast.success(successMessage);
                    }

                    if (itemsContext) {
                        dispatch(apiSlice.util.invalidateTags(['OrdersStatisticsCounters']));
                    } else {
                        dispatch(apiSlice.util.invalidateTags([{ type: 'Orders', id: order.publicId }]));
                    }
                })
                .catch(() => {
                    toast.error(translateOrder<string>('update-error-notification'));
                });
        },
        [dispatch, order.publicId, partiallyUpdateOrder, itemsContext],
    );

    const handleDeleteOrderClick = useCallback(() => {
        dispatch(ordersActions.setDeleteOrderPopupProps({ isVisible: true, publicOrderId: order.publicId, orderId: order.details.orderId }));
    }, [order.details.orderId, dispatch, order.publicId]);

    const handleMarkAsPaidClick = useCallback(() => {
        dispatch(ordersActions.setMarkAsPaidDrawerProps({ isVisible: true, orderId: order.publicId }));
    }, [dispatch, order.publicId]);

    const handleMarkOrderAsNewClick = useCallback(() => {
        dispatch(ordersActions.setMarkAsNewPopupProps({ isVisible: true, publicOrderId: order.publicId }));
    }, [dispatch, order.publicId]);

    const handleSendInvoiceClick = useCallback(() => {
        dispatch(
            ordersActions.setSendInvoiceDrawerProps({
                isVisible: true,
                customerName: order.customerInformation.customerName,
                publicOrderId: order.publicId,
            }),
        );
    }, [order.customerInformation, order.publicId, dispatch]);

    const handleEditOrderClick = useCallback(async () => {
        await router.push(
            {
                pathname: '/client/orders/[order-id]/edit',
                query: { ['order-id']: order.publicId },
            },
            `/orders/${order.publicId}/edit`,
        );
    }, [router, order.publicId]);

    return {
        handleDuplicateClick,
        handleMarkOrderAsFlaggedClick,
        handleMarkOrderAsUnFlaggedClick,
        handleAddInternalNoteClick,
        updateOrder,
        handleDeleteOrderClick,
        handleMarkAsPaidClick,
        handleMarkOrderAsNewClick,
        handleSendInvoiceClick,
        handleEditOrderClick,
    };
}
