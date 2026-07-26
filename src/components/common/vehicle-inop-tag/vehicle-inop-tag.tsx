import React from 'react';

import { OrderTag } from '@components';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:vehicle');

type Props = {
    inop: boolean;
};

export const VehicleInopTag = ({ inop }: Props) => {
    return inop ? <OrderTag view='inop'>{t('inop')}</OrderTag> : null;
};
