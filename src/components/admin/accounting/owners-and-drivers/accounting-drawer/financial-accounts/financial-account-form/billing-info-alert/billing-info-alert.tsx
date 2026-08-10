import React from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

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
