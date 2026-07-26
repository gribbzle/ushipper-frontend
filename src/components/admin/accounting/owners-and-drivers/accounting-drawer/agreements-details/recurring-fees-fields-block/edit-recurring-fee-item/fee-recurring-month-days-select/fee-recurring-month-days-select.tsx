import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';

export const FeeRecurringMonthDaysSelect = (props: FieldRenderProps<string>) => {
    const options = Array.from({ length: 31 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
    }));

    return <SelectField {...props} options={options} />;
};
