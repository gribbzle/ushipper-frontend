import React from 'react';

import { OrderTag } from '@components';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:vehicle');

type Props = {
    enclosed: boolean;
};

export const VehicleEnclosedTag = ({ enclosed }: Props) => {
    return enclosed ? <OrderTag view='enclosed'>{t('enclosed')}</OrderTag> : null;
};
