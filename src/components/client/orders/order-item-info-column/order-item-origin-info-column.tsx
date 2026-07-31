import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { NonNullableFields } from '@/shared';
import { useMeShipper } from '@hooks';
import { Order } from '@store/api/orders-api';
import { translateByNamespace } from '@utils/i18n';
import { getObjectWithoutEmptyFields } from '@utils/objects';

const translateOrderItem = translateByNamespace('client:orders-page:order-item');
const dateTypesT = translateByNamespace('common:date-types');

type Props = Pick<Order, 'pickupInformation'>;
export const OrderItemOriginInfoColumn = ({ pickupInformation }: Props) => {
    const isShipper = useMeShipper();
    const pickupInfoData = useMemo(() => {
        const { businessName, streetAddress, city, state, zip, scheduledPickupAt, fullName, phone, email } = pickupInformation;

        const pickupInfoData = getObjectWithoutEmptyFields({
            businessName,
            streetAddress,
            city,
            state,
            zip,
            scheduledPickupAt: scheduledPickupAt
                ? `${format(new Date(scheduledPickupAt), 'dd/MM/yyyy HH:mm')} ${
                      isShipper && pickupInformation.pickupDateType ? `(${dateTypesT(pickupInformation.pickupDateType)})` : ''
                  }`
                : null,
            fullName,
            phone: phone ? (translateOrderItem('phone-text', { phone }) as string) : null,
            email: email ? (translateOrderItem('email-text', { email }) as string) : null,
        });

        return pickupInfoData as NonNullableFields<typeof pickupInfoData>;
    }, [isShipper, pickupInformation]);

    return <OrderItemInfoColumn infoObject={pickupInfoData} title={translateOrderItem('origin-title')} noDataText={translateOrderItem('no-pickup-info')} />;
};
