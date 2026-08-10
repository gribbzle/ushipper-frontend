import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import {SelectField} from '@/fields/select-field';
import { BalanceAmountType } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:wallets-page:filters');

export const WalletAmountTypeSelect = (props: FieldRenderProps<string>) => {
    const options: { label: string; value: BalanceAmountType }[] = [
        { label: t('positive'), value: 'positive' },
        { label: t('negative'), value: 'negative' },
    ];

    return <SelectField options={options} {...props} />;
};
