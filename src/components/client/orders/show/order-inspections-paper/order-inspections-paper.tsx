import React from 'react';

import { OrderVehicleInspectionDetailsPaper } from '@components';
import { renderProjectSpecificComponent } from '@utils';

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
