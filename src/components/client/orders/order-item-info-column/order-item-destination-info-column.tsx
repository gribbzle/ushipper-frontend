import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { NonNullableFields } from '@/shared';
import { useMeShipper } from '@/hooks/use-user-role-group';
import { Order } from '@store/api/orders-api';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';

const translateOrderItem = translateByNamespace('client:orders-page:order-item');
const dateTypesT = translateByNamespace('common:date-types');

type Props = Pick<Order, 'deliveryInformation'>;
export const OrderItemDestinationInfoColumn = ({ deliveryInformation }: Props) => {
    const isShipper = useMeShipper();
    const deliveryInfoData = useMemo(() => {
        const { businessName, streetAddress, city, state, zip, scheduledDeliveryAt, fullName, phone, email } = deliveryInformation;

        const deliveryInfoData = getObjectWithoutEmptyFields({
            businessName,
            streetAddress,
            city,
            state,
            zip,
            scheduledDeliveryAt: scheduledDeliveryAt
                ? `${format(new Date(scheduledDeliveryAt), 'dd/MM/yyyy HH:mm')} ${
                      isShipper && deliveryInformation.deliveryDateType ? `(${dateTypesT(deliveryInformation.deliveryDateType)})` : ''
                  }`
                : null,
            fullName,
            phone: phone ? (translateOrderItem('phone-text', { phone }) as string) : null,
            email: email ? (translateOrderItem('email-text', { email }) as string) : null,
        });

        return deliveryInfoData as NonNullableFields<typeof deliveryInfoData>;
    }, [isShipper, deliveryInformation]);

    return (
        <OrderItemInfoColumn
            infoObject={deliveryInfoData}
            title={translateOrderItem('destination-title')}
            noDataText={translateOrderItem('no-delivery-info')}
        />
    );
};
