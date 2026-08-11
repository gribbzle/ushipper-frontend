import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { Paper } from '@/components/common/paper/paper';
import { getOrderId } from '@/utils/order';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { CommoditiesDetailsBlock } from '@/components/client/loadboard/common/commodities-details-block/commodities-details-block';
import { OrderRouteDetails } from '@/components/client/loadboard/common/order-route-details/order-route-details';
import { PaymentInfoBlock } from '@/components/client/loadboard/common/payment-info-block/payment-info-block';
import { VehiclesDetailsBlock } from '@/components/client/loadboard/common/vehicles-details-block/vehicles-details-block';

import './order-details.scss';

type OrderDetailsProps = {
    order: Load;
};

const cn = classname('order-details');
const t = translateByNamespace('client:loadboard:load-details');
const tNoData = translateByNamespace('common:order');

export const OrderDetails = ({ order }: OrderDetailsProps) => {
    const { vehicles, commodities, paymentInformation, drivingDistance, details } = order;

    return (
        <Paper
            className={cn()}
            headerClassName={cn('header')}
            header={t('title')}
            bodyClassName={cn('body')}
            body={
                <>
                    <span className={cn('order-id')}>{t('order-id', { orderId: getOrderId(order) })}</span>
                    <OrderRouteDetails order={order} />
                    {renderProjectSpecificComponent(
                        {
                            VehiclesDetailsBlock: <VehiclesDetailsBlock vehicles={vehicles} />,
                            CommoditiesDetailsBlock: <CommoditiesDetailsBlock commodities={commodities} />,
                        },
                        'loadboardProductsDetailsBlock',
                    )}
                    <PaymentInfoBlock paymentInformation={paymentInformation} drivingDistance={drivingDistance} vehicles={vehicles} commodities={commodities} />
                    <OrderItemInfoColumn title={t('additional-info')} className={cn('description')}>
                        {details.instructions ? details.instructions : tNoData('no-data')}
                    </OrderItemInfoColumn>
                </>
            }
        />
    );
};
