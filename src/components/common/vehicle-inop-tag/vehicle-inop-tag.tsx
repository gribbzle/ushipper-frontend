import React from 'react';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:vehicle');

type Props = {
    inop: boolean;
};

export const VehicleInopTag = ({ inop }: Props) => {
    return inop ? <OrderTag view='inop'>{t('inop')}</OrderTag> : null;
};
