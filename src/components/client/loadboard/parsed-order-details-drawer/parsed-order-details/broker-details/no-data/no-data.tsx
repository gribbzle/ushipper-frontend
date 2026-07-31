import React from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './no-data.scss';

const cn = classname('no-data');
const t = translateByNamespace('common:order');

export const NoData = () => {
    return <span className={cn('order-id')}>{t('no-data')}</span>;
};
