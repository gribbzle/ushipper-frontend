import React, { useMemo } from 'react';

import { useQueryFilters } from '@hooks';
import { useAppSelector } from '@store';
import { TrackingOrdersByStatusData } from '@store/api/tracking-api';
import { isShipperOrdersTrackingLoadingSelector, ShipperTrackingFiltersFormState } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getTrackingOrderStatusTranslate } from '@utils/translate/tracking/get-tracking-order-status-translate';

import { ShipperOrdersTab } from '../shipper-tracking-orders-tab';

import './shipper-orders-list-content.scss';

const cn = classname('shipper-orders-list-content');
const tEmpty = translateByNamespace('client:tracking-page:shipper-orders-list-paper');

type ShippersOrdersListByStatusProps = {
    groupedOrders: TrackingOrdersByStatusData[];
};

export const ShippersOrdersListByStatus = ({ groupedOrders }: ShippersOrdersListByStatusProps) => {
    const isLoading = useAppSelector(isShipperOrdersTrackingLoadingSelector);

    const {
        filters: { status: selectedStatus },
    } = useQueryFilters<ShipperTrackingFiltersFormState>();

    const filteredGroups = useMemo(() => {
        if (!selectedStatus || selectedStatus === 'all') {
            return groupedOrders;
        }

        return groupedOrders.filter(group => group.status === selectedStatus);
    }, [groupedOrders, selectedStatus]);

    if (!groupedOrders?.length && !isLoading) {
        return <p className={cn('empty')}>{tEmpty('no-orders')}</p>;
    }

    return (
        <>
            {filteredGroups.map((group, index) => {
                const { status, orders } = group;

                return (
                    <ShipperOrdersTab
                        key={status}
                        title={getTrackingOrderStatusTranslate(status)}
                        showEllipseIcon={true}
                        view={status}
                        opened={index === 0}
                        orders={orders}
                    />
                );
            })}
        </>
    );
};
