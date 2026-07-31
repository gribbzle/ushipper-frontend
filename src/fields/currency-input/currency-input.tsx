import React, { useCallback, useMemo, useState } from 'react';
import has from 'has-values';
import { FieldRenderProps } from 'react-final-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { classname } from '@utils/classname';

import { FormHelperText } from '../form-helper-text';
import { InputAdornment } from '../text-field';

import './currency-input.scss';

const cn = classname('currency-input');

type CurrencyInputProps = FieldRenderProps<string> &
    NumericFormatProps & {
        className?: string;
        error?: string;
        hint?: string;
        maxValue?: number;
        startAdornment?: React.ReactNode;
        endAdornment?: React.ReactNode;
        callback?: (value: string | number) => void;
    };

export const CurrencyInput = ({
    startAdornment,
    endAdornment,
    className,
    callback,
    disabled = false,
    error,
    meta,
    hint,
    input,
    decimalScale = 2,
    thousandsGroupStyle = 'thousand',
    thousandSeparator = ',',
    decimalSeparator = '.',
    maxValue,
    ...rest
}: CurrencyInputProps) => {
    const [focused, setFocused] = useState(false);
    const { onFocus, onBlur, onChange, value, ...inputRest } = input;
    const errored = useMemo<boolean>(() => has(error) || (meta.error && meta.touched) || meta.submitError, [error, meta.error, meta.touched, meta.submitError]);

    const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onFocus?.(e);
            setFocused(true);
        },
        [onFocus],
    );

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            onBlur?.(e);
            setFocused(false);
        },
        [onBlur],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const inputValue = e.target.value.replace(/,/g, '');

            onChange(inputValue);
            callback?.(inputValue);
        },
        [callback, onChange],
    );

    return (
        <>
            <div className={cn('wrapper', { focused, errored, disabled }, [className])}>
                {startAdornment && <InputAdornment>{startAdornment}</InputAdornment>}
                <NumericFormat
                    {...inputRest}
                    {...rest}
                    type='text'
                    thousandsGroupStyle={thousandsGroupStyle}
                    thousandSeparator={thousandSeparator}
                    decimalSeparator={decimalSeparator}
                    decimalScale={decimalScale}
                    value={value}
                    onChange={handleChange}
                    className={cn()}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    isAllowed={({ floatValue }) => floatValue === undefined || maxValue === undefined || floatValue <= maxValue}
                />
                {endAdornment && <InputAdornment>{endAdornment}</InputAdornment>}
            </div>
            {errored && <FormHelperText error={true}>{error || meta.error || meta.submitError}</FormHelperText>}
            {!errored && hint && <FormHelperText>{hint}</FormHelperText>}
        </>
    );
};
