import React, { useMemo } from 'react';

import { OrderCommoditiesInfo, OrderCustomerInfo, OrderInstructions, OrderPaymentInformation, OrderVehiclesInfo, Paper } from '@components';
import { useAppSelector } from '@store';
import { orderCommoditiesSelector, orderVehiclesSelector } from '@store/client';
import { classname, renderProjectSpecificComponent, translateByNamespace } from '@utils';

import './order-details-paper.scss';

const t = translateByNamespace('client:order:order-details');
const cn = classname('order-details-paper');

export const OrderDetailsPaper = () => {
    const vehicles = useAppSelector(orderVehiclesSelector);
    const commodities = useAppSelector(orderCommoditiesSelector);

    const body = useMemo(
        () => (
            <div className={cn()}>
                <div className='vehicles-and-driver-instructions'>
                    {renderProjectSpecificComponent(
                        {
                            OrderVehiclesInfo: <OrderVehiclesInfo vehicles={vehicles ?? []} />,
                            OrderCommoditiesInfo: <OrderCommoditiesInfo commodities={commodities ?? []} />,
                        },
                        'orderProductsInfo',
                    )}
                    <OrderInstructions />
                </div>
                <OrderCustomerInfo />
                <OrderPaymentInformation />
            </div>
        ),
        [vehicles, commodities],
    );

    return <Paper title={t('header')} body={body} />;
};
