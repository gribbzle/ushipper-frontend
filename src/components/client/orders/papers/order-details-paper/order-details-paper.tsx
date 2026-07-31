import React, { useMemo } from 'react';

import { OrderCommoditiesInfo } from '@/components/client/orders/papers/order-commodities-paper/order-commodities-paper';
import { OrderCustomerInfo } from '@/components/client/orders/papers/order-customer-information-paper/order-customer-information-paper';
import { OrderInstructions } from '@/components/client/orders/papers/order-driver-instructions-paper/order-instructions-paper';
import { OrderVehiclesInfo } from '@/components/client/orders/papers/order-vehicles-paper/order-vehicles-paper';
import { OrderPaymentInformation } from '@/components/client/orders/show/order-payment-information/order-payment-information';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useAppSelector } from '@store';
import { orderCommoditiesSelector, orderVehiclesSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

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
