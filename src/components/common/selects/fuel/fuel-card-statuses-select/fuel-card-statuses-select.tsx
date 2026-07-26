import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FuelCardStatus } from '@/enums';
import { SelectField } from '@fields';
import { getFuelCardStatusTranslate, translateByNamespace } from '@utils';

const t = translateByNamespace('common:field');

export const FuelCardStatusesSelect = ({ placeholder, ...props }: FieldRenderProps<string>) => {
    const options = Object.values(FuelCardStatus).map(status => ({
        label: getFuelCardStatusTranslate(status),
        value: status,
    }));

    return <SelectField {...props} options={options} placeholder={placeholder ?? t('all-placeholder')} />;
};
