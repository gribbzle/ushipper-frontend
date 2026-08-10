import React from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { FeeRecurringWeekDay } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:fee-recurring-week-days');

export const FeeRecurringWeekDaysSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(FeeRecurringWeekDay).map(day => ({
        label: t(toKebabCase(day)),
        value: day,
    }));

    return <SelectField {...props} options={options} />;
};
