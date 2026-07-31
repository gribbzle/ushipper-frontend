import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { LoadBoardOrderBrokerColumn, TableColumn, TableRowMenu } from '@/components/common';
import { FundsTransferStatus, OrderSortingDirection, OrderSortingName } from '@/enums';
import { useOrdersActionsPermission } from '@/hooks/order';
import { useCompanyPage, useQueryFilters, useTable } from '@hooks';
import { useGetOrdersQuery, usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { Load } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

import { AssignedInfoBlock } from './assigned-info-block';
import { OrderDetailsBlock } from './order-details-block';
import { PickupDeliveryInfoBlock } from './pickup-delivery-info-block';

import './company-orders-table.scss';

const tActions = translateByNamespace('admin:company-page:company-orders-table');
const translateOrder = translateByNamespace('client:order');

export const useCompanyOrdersTable = () => {
    const { filters } = useQueryFilters();
    const { onPageChangeHandler } = useTable();
    const [updateOrder] = usePartiallyUpdateOrderMutation();
    const hasOrdersActionsPermission = useOrdersActionsPermission();

    const { company } = useCompanyPage();

    const { data: ordersData } = useGetOrdersQuery(
        {
            ...filters,
            orderDirection: filters.orderDirection as OrderSortingDirection,
            orderName: filters.orderName as OrderSortingName,
            companyPublicId: company?.publicId,
        },
        { skip: !company?.publicId },
    );

    const handleConfirmPayment = useCallback(
        (publicOrderId: string) => {
            updateOrder({ publicOrderId, newOrderData: { fundsTransferStatus: FundsTransferStatus.INITIATED } })
                .unwrap()
                .then(() => {
                    toast.success(translateOrder<string>('confirm-payment-success-notification'));
                })
                .catch(() => {
                    toast.success(translateOrder<string>('update-error-notification'));
                });
        },
        [updateOrder],
    );

    const columns = useMemo<TableColumn<Load>[]>(
        () => [
            {
                key: 'details',
                name: 'details',
                cellRender: ({ row }) => <OrderDetailsBlock order={row} />,
            },
            {
                key: 'broker',
                name: 'broker',
                cellRender: ({ row: { details, company } }) => <LoadBoardOrderBrokerColumn company={company} details={details} />,
            },
            {
                key: 'pickup_and_delivery_info',
                name: 'pickupAndDeliveryInfo',
                cellRender: ({ row }) => <PickupDeliveryInfoBlock order={row} />,
            },
            {
                key: 'assigned',
                name: 'assigned',
                cellRender: ({ row }) => <AssignedInfoBlock order={row} />,
            },
            {
                key: 'actions',
                name: '',
                hide: !hasOrdersActionsPermission,
                cellRender: ({ row: { driver, publicId } }) =>
                    driver && (
                        <TableRowMenu
                            dataTestId='company-orders-table-actions'
                            options={[
                                {
                                    label: tActions('confirm-payment-button-label'),
                                    onClick: () => handleConfirmPayment(publicId),
                                },
                            ]}
                        />
                    ),
            },
        ],
        [handleConfirmPayment, hasOrdersActionsPermission],
    );

    return { ordersData, columns, filters, onPageChangeHandler };
};
