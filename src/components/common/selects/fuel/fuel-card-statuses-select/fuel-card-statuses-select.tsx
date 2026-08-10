import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FuelCardStatus } from '@/enums/fuel/fuel-card-status-enum';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';
import { getFuelCardStatusTranslate } from '@utils/translate/fuel/get-fuel-card-status-translate';

const t = translateByNamespace('common:field');

export const FuelCardStatusesSelect = ({ placeholder, ...props }: FieldRenderProps<string>) => {
    const options = Object.values(FuelCardStatus).map(status => ({
        label: getFuelCardStatusTranslate(status),
        value: status,
    }));

    return <SelectField {...props} options={options} placeholder={placeholder ?? t('all-placeholder')} />;
};
