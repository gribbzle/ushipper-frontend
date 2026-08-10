import React, { useEffect } from 'react';
import { useForm } from 'react-final-form';

import {CurrencyPercentageField} from '@/fields/currency-percentage-field';

export type FeeRecurringLimitFieldProps = {
    prefix: string;
    disabled?: boolean;
    defaultValue?: number | null;
    hideSelectionIndicator?: boolean;
    required?: boolean;
    name: string;
};

export const FeeRecurringLimitField = ({ prefix, name, disabled, defaultValue, required = false, ...props }: FeeRecurringLimitFieldProps) => {
    const { batch, change } = useForm();

    useEffect(() => {
        batch(() => {
            change(`${prefix}.${name}`, defaultValue);
        });
    }, [change, batch, prefix, name, defaultValue]);

    return (
        <CurrencyPercentageField prefix={prefix} fieldName='limit' hideSelectionIndicator={true} disabled={disabled} isRequiredCurrency={required} {...props} />
    );
};
