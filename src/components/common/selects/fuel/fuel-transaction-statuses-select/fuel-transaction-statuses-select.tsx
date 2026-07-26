import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FuelTransactionStatus } from '@/enums';
import { SelectField } from '@fields';
import { getFuelTransactionStatusTranslate, translateByNamespace } from '@utils';

const t = translateByNamespace('common:field');

export const FuelTransactionStatusesSelect = ({ placeholder, ...props }: FieldRenderProps<string>) => {
    const options = Object.values(FuelTransactionStatus).map(status => ({
        label: getFuelTransactionStatusTranslate(status),
        value: status,
    }));

    return <SelectField {...props} options={options} placeholder={placeholder ?? t('all-placeholder')} />;
};
