import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { BusinessDaysPaymentMethod, CodCopPaymentMethod, PaymentMethod, PaymentTerm } from '@/enums';
import { getPaymentMethodTranslate } from '@/utils/payment-method-translate';
import {SelectField} from '@/fields/select-field';

type Props = FieldRenderProps<string> & {
    selectedPaymentTerm?: PaymentTerm;
    without?: PaymentMethod[];
};

const paymentMethodMap = {
    [PaymentTerm.COD]: CodCopPaymentMethod,
    [PaymentTerm.COP]: CodCopPaymentMethod,
    [PaymentTerm.OTHER]: PaymentMethod,
    default: BusinessDaysPaymentMethod,
};

export const PaymentMethodsSelect = ({ selectedPaymentTerm, without = [], ...props }: Props) => {
    // TODO update after complete update of all orders in the system
    const paymentMethods = useMemo(() => {
        if (!selectedPaymentTerm || !Object.values(PaymentTerm).includes(selectedPaymentTerm)) {
            return [];
        }

        const methods = paymentMethodMap[selectedPaymentTerm as keyof typeof paymentMethodMap] || paymentMethodMap.default;

        return methods;
    }, [selectedPaymentTerm]);

    const options = useMemo(
        () =>
            Object.values(paymentMethods)
                .filter(paymentMethod => !without.includes(paymentMethod as PaymentMethod))
                .map(paymentMethod => ({
                    label: getPaymentMethodTranslate(paymentMethod),
                    value: paymentMethod,
                })),
        [paymentMethods, without],
    );

    return <SelectField {...props} options={options} />;
};
