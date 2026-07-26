import React from 'react';

import { classname, translateByNamespace } from '@utils';

import './no-data.scss';

const cn = classname('no-data');
const t = translateByNamespace('common:order');

export const NoData = () => {
    return <span className={cn('order-id')}>{t('no-data')}</span>;
};
