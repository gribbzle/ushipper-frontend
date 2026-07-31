import React from 'react';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:vehicle');

type Props = {
    enclosed: boolean;
};

export const VehicleEnclosedTag = ({ enclosed }: Props) => {
    return enclosed ? <OrderTag view='enclosed'>{t('enclosed')}</OrderTag> : null;
};
