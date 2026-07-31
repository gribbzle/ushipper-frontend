import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { LoadBoardOrderVehiclesColumn } from '@/components/client/loadboard/load-board-order/load-board-order-vehicles-column/load-board-order-vehicles-column';
import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { getOrderId } from '@/utils/order';
import { Load } from '@store/client';
import { loadboardActions } from '@store/client/loadboard/slice';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:loadboard:item');
const translateRequestDrawer = translateByNamespace('client:loadboard:request-drawer');

export const LoadboardItemVehiclesColumn = ({ order }: { order: Load }) => {
    const dispatch = useDispatch();

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

    return (
        <OrderItemInfoColumn title={t('vehicles', { counter: order.vehicles.length })}>
            <LoadBoardOrderVehiclesColumn
                onViewMoreClick={() =>
                    viewDetails(
                        translateRequestDrawer('title-3', {
                            orderId: getOrderId(order),
                            brokerCompanyName: order.pickupInformation.businessName ?? '',
                        }),
                    )
                }
                vehicles={order.vehicles}
            />
        </OrderItemInfoColumn>
    );
};
