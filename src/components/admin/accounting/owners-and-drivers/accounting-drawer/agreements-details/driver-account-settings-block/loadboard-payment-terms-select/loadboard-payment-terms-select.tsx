import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { DriverLoadboardPaymentTermEnum } from '@/enums';
import { SelectField } from '@fields';
import { getDriverLoadboardPaymentTermTranslate } from '@utils';

export const LoadboardPaymentTermsSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(DriverLoadboardPaymentTermEnum).map(term => ({
        label: getDriverLoadboardPaymentTermTranslate(term),
        value: term,
    }));

    return <SelectField {...props} options={options} />;
};
