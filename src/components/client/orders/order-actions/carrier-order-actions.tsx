import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { OrderOptionsDropdown } from '@/components';
import { OrderPaymentStatus, OrderStatus } from '@/enums';
import useOrderOptionsHandlers from '@/hooks/order/use-order-options-handlers';
import { Button } from '@components';
import { useIsPartnerCompany, useMeDriverRelated } from '@hooks';
import { HorizontalDotsIcon, UserPlusIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { Load, orderPublicIdSelector, ordersActions } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './order-actions.scss';

type OrderActionsProps = {
    order: Load;
    context: 'orderItem' | 'header';
};

const translateOrder = translateByNamespace('client:order');
const t = translateByNamespace('client:order-actions');
const cn = classname('order-actions');

// eslint-disable-next-line complexity
export const CarrierOrderActions = ({ order, context }: OrderActionsProps) => {
    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();

    const dispatch = useAppDispatch();
    const isDriver = useMeDriverRelated();
    const isPartner = useIsPartnerCompany();
    // Just to check if we need to update fetched order data to see immediate changes on show order page
    // It will be unnecessary when there will be no use of async thunks on show order page (cache update will be handled by rtk query)
    const fetchedOrderPublicId = useAppSelector(orderPublicIdSelector);

    // TODO use OrderContext
    const { driver, publicId, paymentStatus, status, archivedAt, deletedAt } = order;
    const showRestoreButton = useMemo(() => !isDriver && !!deletedAt, [deletedAt, isDriver]);
    const showOptionsButton = useMemo(() => !(deletedAt && status === OrderStatus.NEW), [deletedAt, status]);
    const showEditButton = useMemo(() => !isDriver && !deletedAt, [deletedAt, isDriver]);

    const showAssignDriverButton = useMemo(
        () => !isDriver && (status === OrderStatus.NEW || status === OrderStatus.PICKED_UP) && !driver && !deletedAt,
        [deletedAt, driver, isDriver, status],
    );

    const showReassignDriverButton = useMemo(
        () => !isDriver && (status === OrderStatus.NEW || status === OrderStatus.PICKED_UP) && !!driver && !order.archivedAt,
        [driver, isDriver, order.archivedAt, status],
    );

    const showSendInvoiceButton = useMemo(
        () => !isDriver && status === OrderStatus.DELIVERED && paymentStatus === OrderPaymentStatus.NOT_BILLED && !isPartner,
        [isDriver, isPartner, paymentStatus, status],
    );

    const showMarkAsPaidButton = useMemo(
        () => !isDriver && status === OrderStatus.DELIVERED && paymentStatus === OrderPaymentStatus.BILLED && !isPartner,
        [isDriver, isPartner, paymentStatus, status],
    );

    const showArchiveButton = useMemo(
        () => !isDriver && status === OrderStatus.DELIVERED && paymentStatus === OrderPaymentStatus.PAID && !archivedAt && !isPartner,
        [archivedAt, isDriver, isPartner, paymentStatus, status],
    );

    const isOrderItemContext = context === 'orderItem';

    const handleRestoreClick = useCallback(() => {
        dispatch(ordersActions.setRestoreOrderPopupProps({ isVisible: true, publicOrderId: publicId }));
    }, [dispatch, publicId]);

    const handleAssignDriverButtonClick = useCallback(() => {
        dispatch(ordersActions.setDriverDrawerProps({ isVisible: true, orderId: publicId, selectedUserId: driver?.publicId }));
    }, [dispatch, driver?.publicId, publicId]);

    const handleMarkAsPaidClick = useCallback(() => {
        dispatch(ordersActions.setMarkAsPaidDrawerProps({ isVisible: true, orderId: publicId }));
    }, [dispatch, publicId]);

    const handleSendInvoiceClick = useCallback(() => {
        dispatch(ordersActions.setSendInvoiceDrawerProps({ publicOrderId: publicId, isVisible: true, customerName: order.customerInformation.customerName }));
    }, [dispatch, order.customerInformation.customerName, publicId]);

    const handleArchiveClick = useCallback(() => {
        partiallyUpdateOrder({ publicOrderId: publicId, newOrderData: { isArchived: true } })
            .unwrap()
            .then(order => {
                toast.success(translateOrder('archive-order-success-notification') as string);

                // To update fetchOrder state piece to see changes if we are on the show order page
                if (fetchedOrderPublicId) {
                    dispatch(ordersActions.setOrderData(order as unknown as Load));
                }
            })
            .catch(() => {
                toast.error(translateOrder('archive-order-error-notification') as string);
            });
    }, [dispatch, fetchedOrderPublicId, partiallyUpdateOrder, publicId]);

    const buttonSize = isOrderItemContext ? 'small' : 'medium';

    const optionsButtonContent = useMemo(
        () =>
            isOrderItemContext ? (
                t('options-button-title')
            ) : (
                <>
                    <HorizontalDotsIcon />
                    {t('more-button-title')}
                </>
            ),
        [isOrderItemContext],
    );
    const { handleEditOrderClick } = useOrderOptionsHandlers(order, context === 'orderItem');

    return (
        <div className={cn()}>
            {showReassignDriverButton && (
                <Button size={buttonSize} onClick={handleAssignDriverButtonClick}>
                    {t('reassign-title')}
                </Button>
            )}
            {showAssignDriverButton && (
                <Button view='primary' size={buttonSize} onClick={handleAssignDriverButtonClick}>
                    {!isOrderItemContext && <UserPlusIcon />}
                    {t('assign-driver-title')}
                </Button>
            )}
            {showMarkAsPaidButton && (
                <Button view='primary' size={buttonSize} onClick={handleMarkAsPaidClick}>
                    {t('mark-as-paid-title')}
                </Button>
            )}
            {showSendInvoiceButton && (
                <Button view='primary' size={buttonSize} onClick={handleSendInvoiceClick}>
                    {t('send-invoice-title')}
                </Button>
            )}
            {showArchiveButton && (
                <Button size={buttonSize} onClick={handleArchiveClick}>
                    {t('archive-title')}
                </Button>
            )}
            {showRestoreButton && (
                <Button size={buttonSize} onClick={handleRestoreClick}>
                    {t('restore-title')}
                </Button>
            )}
            {showOptionsButton && (
                <OrderOptionsDropdown order={order} itemsContext={context === 'orderItem'}>
                    <Button size={buttonSize}>{optionsButtonContent}</Button>
                </OrderOptionsDropdown>
            )}
            {showEditButton && (
                <Button onClick={handleEditOrderClick} size={buttonSize} className={`${context}-edit-btn`}>
                    {t('edit-button-title')}
                </Button>
            )}
        </div>
    );
};
