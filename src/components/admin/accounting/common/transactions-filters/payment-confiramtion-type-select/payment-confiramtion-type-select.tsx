import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { PaymentConfirmationType } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { getPaymentConfirmationTypeTranslate } from '@utils/get-payment-confirmation-type-translate';

type PaymentConfirmationTypeSelectProps = FieldRenderProps<string> & {
    additionalOptions?: { label: string; value: string }[];
};

export const PaymentConfirmationTypeSelect = ({ additionalOptions = [], ...props }: PaymentConfirmationTypeSelectProps) => {
    const options = useMemo(
        () => [
            ...additionalOptions,
            ...Object.values(PaymentConfirmationType).map(type => ({
                label: getPaymentConfirmationTypeTranslate(type),
                value: type,
            })),
        ],
        [additionalOptions],
    );

    return <SelectField options={options} {...props} />;
};
