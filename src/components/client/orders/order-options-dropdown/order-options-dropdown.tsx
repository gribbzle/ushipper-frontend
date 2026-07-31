import React, { ReactNode, useCallback, useMemo } from 'react';

import { Dropdown, DropdownDividerOption, DropdownOption } from '@/components/common/dropdown/dropdown';
import { useHandleSendBOLDrawer, useHandleViewBol } from '@/hooks/order';
import useOrderOptionsHandlers from '@/hooks/order/use-order-options-handlers';
import { downloadFileUsingAnchorElement } from '@/utils/files';
import { OrderPaymentStatus, OrderStatisticsStatus, OrderStatus } from '@enums';
import { useIsPartnerCompany, useMeDriverRelated } from '@hooks';
import { useAppDispatch } from '@store';
import { useCreateOrderInvoiceMutation, useLazyGetOrderInvoiceQuery } from '@store/api/order-invoice-api';
import { Load, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useTabValueFromUrl } from '../order-item/hooks';

import './order-options-dropdown.scss';

type OrderOptionsDropdownProps = {
    children: ReactNode;
    order: Load;
    itemsContext: boolean;
};

const translateOrder = translateByNamespace('client:order');
const t = translateByNamespace('client:orders-page:order-options-dropdown');
const tPrint = translateByNamespace('client:order-BOL-page');
const tEdit = translateByNamespace('client:order-actions');
const cn = classname('order-options-dropdown');

//TODO rewrite using useOrder and useOrderHelpers
export const OrderOptionsDropdown = ({ children, order, itemsContext }: OrderOptionsDropdownProps) => {
    // Just to check if we need to update fetched order data to see immediate changes on show order page
    // It will be unnecessary when there will be no use of async thunks on show order page (cache update will be handled by rtk query)
    // const fetcherOrderPublicId = useAppSelector(orderPublicIdSelector);
    const isPartner = useIsPartnerCompany();
    const isDriver = useMeDriverRelated();

    const { statisticsStatus } = useTabValueFromUrl();
    const dispatch = useAppDispatch();
    const [getOrderInvoice] = useLazyGetOrderInvoiceQuery();
    const [createInvoice] = useCreateOrderInvoiceMutation();

    const { dispatcher, driver, publicId, archivedAt, status, paymentStatus, deletedAt } = order;

    const showMarkAsPaid = useMemo(
        () => !isDriver && !isPartner && status !== OrderStatus.DELIVERED && paymentStatus !== OrderPaymentStatus.PAID && !archivedAt,
        [status, paymentStatus, archivedAt, isPartner, isDriver],
    );

    const showMarkAsUnPaid = useMemo(
        () => !isDriver && !isPartner && paymentStatus === OrderPaymentStatus.PAID && !archivedAt,
        [paymentStatus, archivedAt, isPartner, isDriver],
    );

    const showSendInvoice = useMemo(
        () =>
            (!isDriver && isPartner && status === OrderStatus.DELIVERED) ||
            (!isDriver && !isPartner && (status !== OrderStatus.DELIVERED || paymentStatus !== OrderPaymentStatus.NOT_BILLED)),
        [status, paymentStatus, isPartner, isDriver],
    );

    const hideForPartnerViewBol = useMemo(
        () =>
            isPartner &&
            (statisticsStatus === OrderStatisticsStatus.NEW ||
                statisticsStatus === OrderStatisticsStatus.ASSIGNED ||
                statisticsStatus === OrderStatisticsStatus.ARCHIVED),
        [statisticsStatus, isPartner],
    );

    const showViewBol = useMemo(
        () => !hideForPartnerViewBol && [OrderStatus.NEW, OrderStatus.PICKED_UP, OrderStatus.DELIVERED].includes(status) && !archivedAt,
        [hideForPartnerViewBol, status, archivedAt],
    );

    const handleViewBolClick = useHandleViewBol(publicId);
    const handleSendBOLDrawerOpen = useHandleSendBOLDrawer(publicId);

    const handleViewInvoiceClick = useCallback(async () => {
        try {
            const { publicId: invoiceId } = await createInvoice(order.publicId).unwrap();
            const { attachment } = await getOrderInvoice({ publicOrderId: order.publicId, invoiceId }).unwrap();

            downloadFileUsingAnchorElement({ url: attachment.url, filename: attachment.name });
        } catch {}
    }, [createInvoice, getOrderInvoice, order.publicId]);

    const handleUnassignDriverClick = useCallback(() => {
        dispatch(ordersActions.setUnassignDriverPopupProps({ isVisible: true, publicOrderId: publicId }));
    }, [dispatch, publicId]);

    const handleMarkAsPickedUpClick = useCallback(() => {
        dispatch(ordersActions.setMarkAsPickedUpPopupProps({ isVisible: true, publicOrderId: publicId }));
    }, [dispatch, publicId]);

    const handleMarkAsDeliveredClick = useCallback(() => {
        dispatch(ordersActions.setMarkAsDeliveredPopupProps({ isVisible: true, publicOrderId: publicId }));
    }, [dispatch, publicId]);

    const handleAssignDispatcherClick = useCallback(() => {
        dispatch(ordersActions.setDispatcherDrawerProps({ isVisible: true, orderId: publicId }));
    }, [dispatch, publicId]);

    const handleAssignDriverClick = useCallback(() => {
        dispatch(ordersActions.setDriverDrawerProps({ isVisible: true, orderId: publicId }));
    }, [dispatch, publicId]);

    // To update fetchOrder state piece to see changes if we are on the show order page
    // const updateFetchedOrderData = useCallback(
    //     (order: Order) => {
    //         if (fetcherOrderPublicId) {
    //             dispatch(ordersActions.setOrderData(order as unknown as Load));
    //         }
    //     },
    //     [dispatch, fetcherOrderPublicId],
    // );

    const {
        handleDuplicateClick,
        handleMarkOrderAsUnFlaggedClick,
        handleMarkOrderAsFlaggedClick,
        handleAddInternalNoteClick,
        updateOrder,
        handleMarkAsPaidClick,
        handleDeleteOrderClick,
        handleMarkOrderAsNewClick,
        handleSendInvoiceClick,
        handleEditOrderClick,
    } = useOrderOptionsHandlers(order, itemsContext);

    const options: (DropdownOption | DropdownDividerOption)[] = useMemo(
        () => [
            {
                label: t('assign-dispatcher-option'),
                onClick: handleAssignDispatcherClick,
                show: !isDriver && !dispatcher,
            },
            {
                label: t('reassign-dispatcher-option'),
                onClick: handleAssignDispatcherClick,
                show: !isDriver && ((isPartner && !!dispatcher && !archivedAt) || (!isPartner && !!dispatcher)),
            },
            {
                label: t('reassign-driver-option'),
                onClick: handleAssignDriverClick,
                show: !isDriver && status === OrderStatus.DELIVERED && !!driver && !archivedAt,
            },
            {
                label: t('unassign-driver-option'),
                onClick: handleUnassignDriverClick,
                show: !isDriver && !!driver && !archivedAt,
            },
            {
                label: t('duplicate-option'),
                onClick: handleDuplicateClick,
                show: !isDriver && status === OrderStatus.NEW,
            },
            {
                label: t('mark-as-new-option'),
                onClick: handleMarkOrderAsNewClick,
                show: !isDriver && (status === OrderStatus.PICKED_UP || status === OrderStatus.DELIVERED) && !archivedAt,
            },
            {
                label: t('mark-as-picked-up-option'),
                onClick: handleMarkAsPickedUpClick,
                show: !isDriver && (status === OrderStatus.NEW || status === OrderStatus.DELIVERED) && !archivedAt,
            },
            {
                label: t('mark-as-delivered-option'),
                onClick: handleMarkAsDeliveredClick,
                show: !isDriver && status === OrderStatus.PICKED_UP && !archivedAt,
            },
            {
                label: t('send-bol-option'),
                onClick: handleSendBOLDrawerOpen,
            },
            {
                label: t('send-invoice-option'),
                onClick: handleSendInvoiceClick,
                show: showSendInvoice,
            },
            {
                label: t('mark-as-paid-option'),
                onClick: handleMarkAsPaidClick,
                show: showMarkAsPaid,
            },
            {
                label: t('mark-as-unpaid-option'),
                onClick: () => updateOrder({ paymentStatus: OrderPaymentStatus.BILLED }),
                show: showMarkAsUnPaid,
            },
            {
                label: t('flag-option'),
                onClick: handleMarkOrderAsFlaggedClick,
                show: !order.isFlagged,
            },
            { label: t('unflag-option'), onClick: handleMarkOrderAsUnFlaggedClick, show: order.isFlagged },
            {
                label: t('add-internal-note-option'),
                onClick: handleAddInternalNoteClick,
                show: !isDriver,
            },
            {
                divider: true,
                show: !hideForPartnerViewBol && !((status === OrderStatus.PICKED_UP || status === OrderStatus.DELIVERED) && !archivedAt),
            },
            {
                divider: true,
                show: (status === OrderStatus.PICKED_UP || status === OrderStatus.DELIVERED) && !archivedAt,
            },
            {
                label: t('view-bol-option'),
                onClick: handleViewBolClick,
                show: showViewBol,
            },
            {
                label: t('view-invoice-option'),
                onClick: handleViewInvoiceClick,
                show: !isPartner && !isDriver && status === OrderStatus.NEW,
            },
            {
                divider: true,
                show: !isDriver,
            },
            {
                label: t('archive-option'),
                onClick: () => updateOrder({ isArchived: true }, translateOrder('archive-order-success-notification')),
                show: !isDriver && paymentStatus !== OrderPaymentStatus.PAID && !archivedAt,
            },
            {
                label: t('unarchive-option'),
                onClick: () => updateOrder({ isArchived: false }, translateOrder('unarchive-order-success-notification')),
                show: !isDriver && !!archivedAt,
            },
            {
                label: t('delete-option'),
                onClick: handleDeleteOrderClick,
                show: !isDriver && !deletedAt,
            },
            {
                label: tEdit('edit-button-title'),
                onClick: handleEditOrderClick,
                show: !isDriver && !deletedAt && !itemsContext,
            },
            {
                label: tPrint('header-button-print-short-title'),
                onClick: () => window.print(),
                show: !isDriver && !itemsContext,
            },
        ],
        [
            handleAssignDispatcherClick,
            isDriver,
            dispatcher,
            isPartner,
            archivedAt,
            handleAssignDriverClick,
            status,
            driver,
            handleUnassignDriverClick,
            handleDuplicateClick,
            handleMarkOrderAsNewClick,
            handleMarkAsPickedUpClick,
            handleMarkAsDeliveredClick,
            handleSendBOLDrawerOpen,
            handleSendInvoiceClick,
            showSendInvoice,
            handleMarkAsPaidClick,
            showMarkAsPaid,
            showMarkAsUnPaid,
            handleMarkOrderAsFlaggedClick,
            order.isFlagged,
            handleMarkOrderAsUnFlaggedClick,
            handleAddInternalNoteClick,
            hideForPartnerViewBol,
            handleViewBolClick,
            showViewBol,
            handleViewInvoiceClick,
            paymentStatus,
            handleDeleteOrderClick,
            deletedAt,
            handleEditOrderClick,
            itemsContext,
            updateOrder,
        ],
    );

    return (
        <Dropdown className={cn()} options={options}>
            {children}
        </Dropdown>
    );
};
