import React, { useMemo } from 'react';

import { OrderInspection } from '@/components/client/orders/order-inspection/order-inspection';
import { Paper } from '@/components/common/paper/paper';
import { CarrierOrder } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './shipper-order-vehicle-inspection-details-paper.scss';

const cn = classname('shipper-order-inspection-details-paper');
const t = translateByNamespace('client:order:inspection');

type Props = {
    carrierOrder: CarrierOrder;
};

export const ShipperOrderVehicleInspectionDetailsPaper = ({ carrierOrder }: Props) => {
    const vehicles = useMemo(
        () =>
            carrierOrder.vehicles.map((vehicle, index) => (
                <OrderInspection key={vehicle.id} vehicle={vehicle} orderId={carrierOrder.publicId} isClose={index !== 0} />
            )),
        [carrierOrder],
    );

    return <Paper className={cn('')} title={t('inspection-details')} body={vehicles} />;
};
