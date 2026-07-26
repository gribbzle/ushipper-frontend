import React, { useMemo } from 'react';

import { getDestination } from '@/utils/driving';
import { getOrderId } from '@/utils/order';
import { calculateTotalPayment } from '@/utils/payment';
import { MileCostTooltip, OrderRoute } from '@components';
import { Load } from '@store/client';
import { classname, formatToCurrency, translateByNamespace } from '@utils';

const t = translateByNamespace('client:requests-page:drawer');
const cn = classname('requests-drawer');

type Props = {
    order: Load;
};

export const RequestOrderInfo = ({ order }: Props) => {
    const { pickupInformation, deliveryInformation, paymentInformation, drivingDistance, vehicles, commodities } = order;

    const totalAmount = useMemo(() => calculateTotalPayment(paymentInformation), [paymentInformation]);

    return (
        <div className={cn('order-info')}>
            <div className={cn('order-id')}>{t('order-id-label', { orderId: getOrderId(order) })}</div>
            <div className={cn('route-info')}>
                <OrderRoute inline={true} pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} />
                {drivingDistance && <p className={cn('distance')}>{getDestination(drivingDistance)}</p>}
            </div>
            {totalAmount > 0 && (
                <div className={cn('price-container')}>
                    <span className={cn('price')}>{formatToCurrency(totalAmount)}</span>
                    <MileCostTooltip
                        drivingDistance={drivingDistance}
                        paymentInformation={paymentInformation}
                        vehicles={vehicles}
                        commodities={commodities}
                        classNameTitle={cn('price-per-distance')}
                    />
                </div>
            )}
        </div>
    );
};
