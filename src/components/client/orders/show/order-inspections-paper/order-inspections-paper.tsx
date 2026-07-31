import React from 'react';

import { OrderVehicleInspectionDetailsPaper } from '@/components/client/orders/papers/order-vehicle-inspection-details-paper/order-vehicle-inspection-details-paper';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

export const OrderInspectionsPaper = () => (
    <>
        {renderProjectSpecificComponent(
            {
                OrderVehicleInspectionDetailsPaper: <OrderVehicleInspectionDetailsPaper />,
                OrderCommodityInspectionDetailsPaper: <></>,
            },
            'orderInspectionsPaper',
        )}
    </>
);
