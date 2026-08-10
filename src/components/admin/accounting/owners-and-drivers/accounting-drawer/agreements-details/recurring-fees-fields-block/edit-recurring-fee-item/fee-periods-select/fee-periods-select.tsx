import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FeePeriod } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:fee-periods');

export const FeePeriodsSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(FeePeriod).map(period => ({
        label: t(period),
        value: period,
    }));

    return <SelectField {...props} options={options} />;
};
