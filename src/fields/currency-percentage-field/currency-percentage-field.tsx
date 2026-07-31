import React from 'react';
import { Field } from 'react-final-form';

import { FormHelperText } from '@/fields/form-helper-text/form-helper-text';
import { classname } from '@utils/classname';
import { required, requiredCurrency } from '@validators';

import { CurrencyPercentageFieldProps } from './currency-percentage-field.types';
import { CurrencyPercentageSelect } from './currency-percentage-select';
import { CurrencyValueInput } from './currency-value-input';
import { useCurrencyPercentageField } from './use-currency-percentage-field';

import './currency-percentage-field.scss';

const cn = classname('currency-percentage-field');

export const CurrencyPercentageField = ({
    fieldName,
    prefix,
    disabled,
    selectedValue,
    hideSelectionIndicator,
    isRequiredCurrency = true,
}: CurrencyPercentageFieldProps) => {
    const { handleError, handleFocused, error, errored, focused, feeValueFieldName, feeValueTypeFieldName } = useCurrencyPercentageField({
        fieldName,
        prefix,
        selectedValue,
    });

    return (
        <>
            <div className={cn('', { focused, errored, disabled })}>
                <Field
                    name={feeValueFieldName}
                    className={cn('input')}
                    validate={isRequiredCurrency ? requiredCurrency : undefined}
                    component={CurrencyValueInput}
                    placeholder=''
                    onFocused={handleFocused}
                    onError={handleError}
                    disabled={disabled}
                    parse={value => value}
                />
                <Field
                    name={feeValueTypeFieldName}
                    validate={required}
                    className={cn('select')}
                    component={CurrencyPercentageSelect}
                    disabled={disabled || hideSelectionIndicator}
                    hideSelectionIndicator={hideSelectionIndicator}
                />
            </div>
            {errored && <FormHelperText error={true}>{error}</FormHelperText>}
        </>
    );
};
