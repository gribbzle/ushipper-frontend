import React from 'react';

import { AlertBlock } from '@/components/common';
import { classname, translateByNamespace } from '@utils';

import './billing-info-alert.scss';

const cn = classname('billing-info-alert');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:billing-info');

export const BillingInfoAlert = () => {
    return (
        <AlertBlock>
            {t('prefix')} <span className={cn()}>{t('strong-text')}</span> {t('suffix')}
        </AlertBlock>
    );
};
