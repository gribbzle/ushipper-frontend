import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { DriverLoadboardPaymentTermEnum } from '@/enums/driver-loadboard-payment-terms-enum';
import {SelectField} from '@/fields/select-field';
import { getDriverLoadboardPaymentTermTranslate } from '@utils/translate/get-driver-loadboard-payment-terms-translate';

export const LoadboardPaymentTermsSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(DriverLoadboardPaymentTermEnum).map(term => ({
        label: getDriverLoadboardPaymentTermTranslate(term),
        value: term,
    }));

    return <SelectField {...props} options={options} />;
};
