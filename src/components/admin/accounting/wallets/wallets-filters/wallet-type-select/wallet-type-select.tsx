import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:wallets-page:table');

export const WalletTypeSelect = ({ ...props }: FieldRenderProps<string>) => {
    const options: SelectOption[] = [
        { label: t('system-label'), value: 'system' },
        { label: t('custom-label'), value: 'custom' },
    ];

    return <SelectField options={options} {...props} />;
};
