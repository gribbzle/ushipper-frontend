import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { Input } from '@/components/common/input/input';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './string-input.scss';

type Props = {
    input: FieldRenderProps<string>['input'];
    meta: FieldRenderProps<string>['meta'];
    label?: string;
    help?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    textarea?: boolean;
    resize?: 'vertical' | 'horizontal' | 'both' | 'none';
    autoComplete?: string;
    onChangeText?: (value: string) => void;
    suffix?: React.ReactNode;
    adornment?: React.ReactNode;
    disabled?: boolean;
    inputSize?: 'default' | 'medium';
};

const t = translateByNamespace('common:string-input');
const cn = classname('string-input');

export const StringInput = (props: Props) => {
    const {
        input,
        meta,
        label,
        help,
        placeholder,
        required,
        disabled,
        className,
        textarea,
        autoComplete,
        resize = 'vertical',
        onChangeText,
        suffix,
        adornment,
        inputSize,
    } = props;
    const { active, touched, submitError, dirtySinceLastSubmit } = meta;
    const { name, onChange, ...inputProps } = input;

    const error = meta.error || (!dirtySinceLastSubmit && submitError);
    const isErrorVisible = !active && touched && !!error;
    const helpText = (isErrorVisible && error) || help;

    const placeholderText = placeholder === undefined ? t('placeholder') : placeholder;

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const text = e.target.value;

            onChange(text);
            onChangeText?.(text);
        },
        [onChange, onChangeText],
    );

    return (
        <div className={cn('', [className])}>
            {label && (
                <label className={cn('label')} htmlFor={name}>
                    {required && <span className={cn('label-required')}>* </span>}
                    {label}
                </label>
            )}
            {textarea ? (
                <textarea
                    style={{ resize }}
                    name={name}
                    className={cn('textarea-input', { warning: isErrorVisible, disabled: !!disabled })}
                    autoComplete={autoComplete}
                    placeholder={placeholderText}
                    onChange={handleChange}
                    disabled={disabled}
                    {...inputProps}
                />
            ) : (
                <Input
                    className={cn('input', { warning: isErrorVisible, disabled: !!disabled })}
                    onChange={handleChange}
                    name={name}
                    warning={isErrorVisible}
                    placeholder={placeholderText}
                    autoComplete={autoComplete}
                    endAdornment={suffix}
                    startAdornment={adornment}
                    inputSize={inputSize}
                    disabled={disabled}
                    {...inputProps}
                />
            )}
            {helpText && <div className={cn('help', { warning: isErrorVisible })}>{helpText}</div>}
        </div>
    );
};
