import { MaskProps, useMask } from '@react-input/mask';
import React, { DetailedHTMLProps, InputHTMLAttributes, TextareaHTMLAttributes, useCallback, useMemo, useState } from 'react';
import has from 'has-values';
import { FieldRenderProps } from 'react-final-form';

import { FormHelperText } from '@/fields/form-helper-text/form-helper-text';
import { InputAdornment } from '@/fields/text-field/input-adornment/input-adornment';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { checkIfValidNumberInput } from '@utils/numbers';

import './text-field.scss';
import LoaderIcon from '@/assets/icons/small-loader.svg';

const cn = classname('text-field');
const t = translateByNamespace('common:field');

export type TextFieldProps = FieldRenderProps<string> & {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    isLoading?: boolean;
    callback?: (value: string | number) => void;
    error?: string;
    multiline?: boolean;
    hint?: string;
    disabled?: boolean;
    autoComplete?: string;
    mask?: MaskProps;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export const TextField = ({
    hint,
    mask,
    meta,
    error,
    input,
    className,
    autoComplete,
    endAdornment,
    startAdornment,
    disabled = false,
    isLoading = false,
    multiline = false,
    resize,
    placeholder = t('default-placeholder'),
    callback,
    onKeyDown,
}: TextFieldProps) => {
    const [focused, setFocused] = useState(false);
    const { onFocus, onBlur, name, value, type, ...inputRest } = input;

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
            const { value } = e.target;

            input.onChange(value);
            callback?.(value);
        },
        [callback, input],
    );

    const handleWheel = useCallback(
        (e: React.WheelEvent<HTMLInputElement>) => {
            if (type === 'number') {
                e.preventDefault();
                e.currentTarget.blur();
            }
        },
        [type],
    );

    const inputRef = useMask(mask);

    return (
        <>
            {multiline && (
                <NativeTextArea
                    value={value}
                    name={name}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={className}
                    errored={!!errored}
                    focused={focused}
                    placeholder={placeholder}
                    disabled={disabled}
                    resize={resize}
                />
            )}
            {!multiline && (
                <NativeInput
                    {...inputRest}
                    type={type}
                    name={name}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyDownCapture={onKeyDown}
                    onWheel={handleWheel}
                    placeholder={placeholder}
                    isLoading={isLoading}
                    startAdornment={startAdornment}
                    endAdornment={endAdornment}
                    className={className}
                    errored={!!errored}
                    focused={focused}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    onKeyDown={type === 'number' ? checkIfValidNumberInput : undefined}
                    {...(mask ? { inputRef } : {})}
                />
            )}
            {errored && <FormHelperText error={true}>{error || meta.error || meta.submitError}</FormHelperText>}
            {!errored && hint && <FormHelperText>{hint}</FormHelperText>}
        </>
    );
};

export type NativeInputProps = InputHTMLAttributes<HTMLInputElement> & {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    errored?: boolean;
    focused?: boolean;
    autoComplete?: string;
    inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

export const NativeInput = ({
    startAdornment,
    endAdornment,
    className,
    isLoading,
    errored = false,
    focused = false,
    disabled = false,
    inputRef,
    ...rest
}: NativeInputProps) => (
    <div className={cn('wrapper', { focused, errored, disabled, 'end-adornment': !!endAdornment }, [className])}>
        {startAdornment && <InputAdornment>{startAdornment}</InputAdornment>}
        <input ref={inputRef} className={cn()} disabled={disabled} {...rest} />
        {endAdornment && <InputAdornment reversePadding={true}>{endAdornment}</InputAdornment>}
        {isLoading && <LoaderIcon className={cn('loader')} />}
    </div>
);

type NativeTextAreaProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
    className?: string;
    errored?: boolean;
    focused?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
};

export const NativeTextArea = ({ focused = false, errored = false, disabled = false, name, className, value, resize, ...rest }: NativeTextAreaProps) => (
    <textarea
        className={cn('textarea', { focused, errored, disabled }, className)}
        value={value}
        disabled={disabled}
        style={{ resize }}
        name={name}
        rows={4}
        {...rest}
    />
);
