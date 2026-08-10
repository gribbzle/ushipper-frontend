import React, { useMemo } from 'react';

import { PaymentTerm } from '@/enums';
import { getPaymentTermTranslate } from '@/utils/payment';
import {SelectField} from '@/fields/select-field';

import { PaymentTermsSelectProps } from './payment-terms-select.types';

export const PaymentTermsSelect = ({ values, disabledOtherOption = false, ...rest }: PaymentTermsSelectProps) => {
    const options = useMemo(
        () =>
            Object.values(values ?? PaymentTerm).map(paymentTerm => ({
                label: getPaymentTermTranslate(paymentTerm as PaymentTerm),
                value: paymentTerm,
                isDisabled: disabledOtherOption && paymentTerm === PaymentTerm.OTHER,
            })),
        [values, disabledOtherOption],
    );

    return <SelectField isClearable={false} options={options} {...rest} />;
};
