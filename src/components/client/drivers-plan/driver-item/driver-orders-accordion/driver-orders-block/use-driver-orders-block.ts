import { useMemo } from 'react';

import { OrderStatisticsStatus } from '@enums';
import { GetOrdersData, useGetOrdersQuery } from '@store/api/orders-api';

import { BASE_ORDERS_FILTERS } from './constants';

export const useDriverOrdersBlock = (driverId: string) => {
    const requestedOrdersFilters = useMemo(() => ({ ...BASE_ORDERS_FILTERS, drivers: [driverId], hasOrderRequests: 1 }), [driverId]);

    const assignedOrdersFilters = useMemo(
        (): GetOrdersData => ({ ...BASE_ORDERS_FILTERS, drivers: [driverId], statisticsStatus: OrderStatisticsStatus.ASSIGNED }),
        [driverId],
    );

    const pickedUpOrdersFilters = useMemo(
        (): GetOrdersData => ({ ...BASE_ORDERS_FILTERS, drivers: [driverId], statisticsStatus: OrderStatisticsStatus.PICKED_UP }),
        [driverId],
    );

    const { data: requestedOrdersPaginatedData } = useGetOrdersQuery(requestedOrdersFilters, { skip: !driverId });
    const { data: assignedOrdersPaginatedData } = useGetOrdersQuery(assignedOrdersFilters, { skip: !driverId });
    const { data: pickedUpOrdersPaginatedData } = useGetOrdersQuery(pickedUpOrdersFilters, { skip: !driverId });

    return {
        assignedOrdersFilters,
        assignedOrders: assignedOrdersPaginatedData?.data,
        pickedUpOrdersFilters,
        pickedUpdOrders: pickedUpOrdersPaginatedData?.data,
        requestedOrdersFilters,
        requestedOrders: requestedOrdersPaginatedData?.data,
    };
};
