import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CurrencyInput } from '@fields';

import { useCurrencyValueInput } from './use-currency-value-input';

export const CurrencyValueInput = ({ input, meta, onFocused, onError, ...rest }: FieldRenderProps<string>) => {
    useCurrencyValueInput({ meta, onError });

    return (
        <CurrencyInput
            meta={meta}
            input={{
                ...input,
                onFocus: () => {
                    onFocused(true);
                    input?.onFocus();
                },
                onBlur: () => {
                    input?.onBlur();
                    onFocused(false);
                },
            }}
            {...rest}
        />
    );
};
