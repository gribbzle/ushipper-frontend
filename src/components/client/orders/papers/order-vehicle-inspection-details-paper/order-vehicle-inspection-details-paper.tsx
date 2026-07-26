import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { OrderInspection } from '@/components';
import { Paper } from '@/components/common';
import { useGetOrderVehiclesQuery } from '@store/api/order-vehicle-api';
import { classname, translateByNamespace } from '@utils';

import './order-vehicle-inspection-details-paper.scss';

const cn = classname('order-inspection-details-paper');
const t = translateByNamespace('client:order:inspection');

export const OrderVehicleInspectionDetailsPaper = () => {
    const router = useRouter();
    const orderId = router.query['order-id'] as string;
    const { data: orderVehicles = [] } = useGetOrderVehiclesQuery(orderId, { skip: !orderId });

    const vehicles = useMemo(
        () => orderVehicles.map((vehicle, index) => <OrderInspection key={vehicle.id} vehicle={vehicle} orderId={orderId} isClose={index !== 0} />),
        [orderVehicles, orderId],
    );

    if (!orderId || !orderVehicles.length) {
        return null;
    }

    return <Paper className={cn('')} title={t('inspection-details')} body={vehicles} />;
};
