import React, { useMemo } from 'react';

import { useShipperOrderActions } from '@/components/client/orders/order-actions/use-shipper-order-actions';
import { Button } from '@/components/common/button/button';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { DropdownDividerOption } from '@/components/common/dropdown/dropdown';
import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { OrderPaymentStatus, OrderStatus } from '@/enums';
import useOrderOptionsHandlers from '@/hooks/order/use-order-options-handlers';
import { HorizontalDotsIcon } from '@icons';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

const translateOrder = translateByNamespace('client:order');
const actionsTranslate = translateByNamespace('client:order-actions');
const optionsTranslate = translateByNamespace('client:orders-page:order-options-dropdown');
const tPrint = translateByNamespace('client:order-BOL-page');
const tPostUnPost = translateByNamespace('client:orders-page:order-item');
const cn = classname('order-item');

type Props = {
    order: Load;
    showMoreBtn: boolean;
    itemsContext?: boolean;
};
export default function ShipperOptionsDropdown({ order, showMoreBtn, itemsContext }: Props) {
    const { status, paymentStatus, archivedAt, deletedAt, countOfNewRequests } = order;

    const {
        handleDuplicateClick,
        handleMarkOrderAsUnFlaggedClick,
        handleMarkOrderAsFlaggedClick,
        handleAddInternalNoteClick,
        updateOrder,
        handleDeleteOrderClick,
        handleMarkOrderAsNewClick,
        handleMarkAsPaidClick,
        handleSendInvoiceClick,
    } = useOrderOptionsHandlers(order, itemsContext);

    const { handleEditOrderClick, downloadBol, openRequestsDrawer, upPostFromLoadBoard, postToLoadBoard } = useShipperOrderActions(order, itemsContext);

    const options = useMemo<Array<DropdownOption | DropdownDividerOption>>(() => {
        return [
            {
                label: tPostUnPost('post'),
                onClick: postToLoadBoard,
                show: !order.archivedAt && !order.deletedAt && status === OrderStatus.NEW && !itemsContext,
            },
            {
                label: tPostUnPost('unpost'),
                onClick: upPostFromLoadBoard,
                show: !order.archivedAt && !order.deletedAt && order.status === OrderStatus.POSTED && !itemsContext,
            },
            {
                label: optionsTranslate('requests'),
                onClick: openRequestsDrawer,
                show: status !== OrderStatus.POSTED && countOfNewRequests > 0,
            },
            {
                label: optionsTranslate('download-bol'),
                onClick: downloadBol,
                show: !order.deletedAt,
            },
            { divider: status === OrderStatus.NEW },
            {
                label: optionsTranslate('mark-as-new-option'),
                onClick: handleMarkOrderAsNewClick,
                show: status !== OrderStatus.NEW && !archivedAt,
            },
            {
                label: optionsTranslate('mark-as-on-hold'),
                onClick: () => updateOrder({ status: OrderStatus.ON_HOLD }, actionsTranslate('on-hold-success')),
                show: status === OrderStatus.NEW,
            },
            {
                label: optionsTranslate('mark-as-accepted'),
                onClick: () => updateOrder({ status: OrderStatus.ACCEPTED }, actionsTranslate('accept-success')),
                show: status !== OrderStatus.ACCEPTED,
            },
            {
                label: optionsTranslate('mark-as-pending'),
                onClick: () => updateOrder({ status: OrderStatus.PENDING }, actionsTranslate('mark-as-pending-success')),
                show: status !== OrderStatus.PENDING && !archivedAt,
            },
            {
                label: optionsTranslate('mark-as-paid-option'),
                onClick: handleMarkAsPaidClick,
                show: status !== OrderStatus.DELIVERED && paymentStatus !== OrderPaymentStatus.PAID && !archivedAt,
            },
            {
                label: optionsTranslate('mark-as-unpaid-option'),
                onClick: () => updateOrder({ paymentStatus: OrderPaymentStatus.BILLED }, actionsTranslate('bill-success')),
                show: paymentStatus === OrderPaymentStatus.PAID && !archivedAt,
            },
            {
                label: optionsTranslate('send-invoice-option'),
                onClick: handleSendInvoiceClick,
                show: status !== OrderStatus.DELIVERED && paymentStatus !== OrderPaymentStatus.NOT_BILLED,
            },
            { divider: true },
            {
                label: optionsTranslate('duplicate-option'),
                onClick: handleDuplicateClick,
                show: status === OrderStatus.NEW,
            },
            {
                label: optionsTranslate('flag-option'),
                onClick: handleMarkOrderAsFlaggedClick,
                show: !order.isFlagged,
            },

            { label: optionsTranslate('unflag-option'), onClick: handleMarkOrderAsUnFlaggedClick, show: order.isFlagged },
            {
                label: optionsTranslate('add-internal-note-option'),
                onClick: handleAddInternalNoteClick,
            },
            { divider: true },
            {
                label: optionsTranslate('cancel-option'),
                onClick: () => updateOrder({ status: OrderStatus.CANCELED }, translateOrder('success-updated-notification')),
                show: status !== OrderStatus.DECLINED && status !== OrderStatus.CANCELED,
            },
            {
                label: optionsTranslate('archive-option'),
                onClick: () => updateOrder({ isArchived: true }, translateOrder('archive-order-success-notification')),
                show: paymentStatus !== OrderPaymentStatus.PAID && !archivedAt,
            },
            {
                label: optionsTranslate('unarchive-option'),
                onClick: () => updateOrder({ isArchived: false }, translateOrder('unarchive-order-success-notification')),
                show: !!archivedAt,
            },
            {
                label: optionsTranslate('delete-option'),
                onClick: handleDeleteOrderClick,
                show: !deletedAt,
            },
            {
                label: actionsTranslate('edit-button-title'),
                onClick: handleEditOrderClick,
                show: !order.deletedAt && !itemsContext,
            },
            {
                label: tPrint('header-button-print-short-title'),
                onClick: () => window.print(),
                show: !itemsContext,
            },
        ];
    }, [
        postToLoadBoard,
        order.archivedAt,
        order.deletedAt,
        order.status,
        order.isFlagged,
        status,
        itemsContext,
        upPostFromLoadBoard,
        openRequestsDrawer,
        countOfNewRequests,
        downloadBol,
        handleMarkOrderAsNewClick,
        archivedAt,
        handleMarkAsPaidClick,
        paymentStatus,
        handleSendInvoiceClick,
        handleDuplicateClick,
        handleMarkOrderAsFlaggedClick,
        handleMarkOrderAsUnFlaggedClick,
        handleAddInternalNoteClick,
        handleDeleteOrderClick,
        deletedAt,
        handleEditOrderClick,
        updateOrder,
    ]);

    return (
        <Dropdown className={cn()} options={options}>
            <Button size='small'>
                {showMoreBtn ? (
                    <>
                        <HorizontalDotsIcon />
                        {actionsTranslate('more-button-title')}
                    </>
                ) : (
                    actionsTranslate('options-button-title')
                )}
            </Button>
        </Dropdown>
    );
}
