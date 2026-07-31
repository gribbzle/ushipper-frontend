import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Paper } from '@/components/common/paper/paper';
import { OrderStatus } from '@/enums';
import { useAppSelector } from '@store';
import {
    orderBOLOrderDeliveryInformationSelector,
    orderBOLOrderPickupInformationSelector,
    orderBOLOrderSelector,
    orderBOLOrderStatusSelector,
} from '@store/client/order-BOL';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Activity } from './activity';
import { Map } from './map';
import { OrderInfo } from './order-info';

import './order-bol-details.scss';

const t = translateByNamespace('client:order-BOL-page');
const cn = classname('order-bol-details');

type Props = {
    className?: string;
};

export const OrderBolDetails = ({ className }: Props) => {
    const order = useAppSelector(orderBOLOrderSelector);
    const status = useAppSelector(orderBOLOrderStatusSelector);
    const deliveryInformation = useAppSelector(orderBOLOrderDeliveryInformationSelector);
    const pickupInformation = useAppSelector(orderBOLOrderPickupInformationSelector);

    const alert = useMemo(
        () => (
            <>
                {(status === OrderStatus.ACCEPTED || status === OrderStatus.NEW) && pickupInformation?.scheduledPickupAt && (
                    <AlertBlock className={cn('alert')} view='default'>
                        {t('pickup-scheduled-on', { date: format(new Date(pickupInformation.scheduledPickupAt), 'MMMM, d') })}
                    </AlertBlock>
                )}
                {status === OrderStatus.PICKED_UP && deliveryInformation?.scheduledDeliveryAt && (
                    <AlertBlock className={cn('alert')} view='warning'>
                        {t('scheduled-delivery-on', { date: format(new Date(deliveryInformation.scheduledDeliveryAt), 'MMMM, d') })}
                    </AlertBlock>
                )}
                {status === OrderStatus.DELIVERED && order?.deliveredAt && (
                    <AlertBlock className={cn('alert')} view='success'>
                        {t('delivered-on', { date: format(new Date(order.deliveredAt), 'MMMM, d') })}
                    </AlertBlock>
                )}
            </>
        ),
        [deliveryInformation?.scheduledDeliveryAt, order?.deliveredAt, pickupInformation?.scheduledPickupAt, status],
    );

    if (!order) {
        return null;
    }

    return (
        <Paper
            className={className}
            title={t('order-BOL-details-title')}
            body={
                <div className={cn()}>
                    <OrderInfo className={cn('order-info')} />
                    {alert}
                    <Activity className={cn('activity')} />
                    <Map className={cn('map')} pickupInformation={order.pickupInformation} deliveryInformation={order.deliveryInformation} />
                </div>
            }
        />
    );
};
