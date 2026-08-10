import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { TrackingOrdersByDispatcherData, TrackingOrdersByStatusData } from '@store/api/tracking-api';
import { ShipperTrackingFiltersFormState } from '@store/client';
import { classname } from '@utils/classname';

import { ShippersOrdersListPaperProps } from '../shipper-orders-list-paper.types';

import { ShippersOrdersListByManager } from './shipper-orders-list-by-manager';
import { ShippersOrdersListByStatus } from './shipper-orders-list-by-status';

import './shipper-orders-list-content.scss';

const cn = classname('shipper-orders-list-content');

export const ShippersOrdersListContent = ({ groupedOrders }: Pick<ShippersOrdersListPaperProps, 'groupedOrders'>) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const [availableHeight, setAvailableHeight] = useState<number>();

    const {
        filters: { grouping },
    } = useQueryFilters<ShipperTrackingFiltersFormState>();

    const calculateAvailableHeight = useCallback(() => {
        const parentElement = parentRef.current;

        if (parentElement) {
            const parentHeight = parentElement.clientHeight;

            setAvailableHeight(parentHeight);
        }
    }, []);

    useEffect(() => {
        calculateAvailableHeight();
        window.addEventListener('resize', calculateAvailableHeight);

        return () => {
            window.removeEventListener('resize', calculateAvailableHeight);
        };
    }, [calculateAvailableHeight]);

    const dispatcherOrders = groupedOrders?.filter((group): group is TrackingOrdersByDispatcherData => 'dispatcher' in group);
    const statusOrders = groupedOrders?.filter((group): group is TrackingOrdersByStatusData => 'status' in group);

    return (
        <div className={cn('')} ref={parentRef} style={{ maxHeight: availableHeight }}>
            <div className={cn('')} ref={parentRef} style={{ maxHeight: availableHeight }}>
                {grouping === 'dispatcher' ? (
                    <ShippersOrdersListByManager groupedOrders={dispatcherOrders ?? []} />
                ) : (
                    <ShippersOrdersListByStatus groupedOrders={statusOrders ?? []} />
                )}
            </div>
        </div>
    );
};
