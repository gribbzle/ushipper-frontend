import React, { ReactNode, useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { classname } from '@utils/classname';

import './radio-panel-input.scss';

type RadioPanelOption = {
    value: string;
    label: ReactNode | string;
    disabled?: boolean;
};

type Props = {
    input: FieldRenderProps<string>['input'];
    meta: FieldRenderProps<string>['meta'];
    label: string;
    required: boolean;
    options: RadioPanelOption[];
    withDots: boolean;
    onInputChange?: (value: string) => void;
};

const cn = classname('radio-panel-input');

export const RadioPanelInput = (props: Props) => {
    const { input, meta, options, onInputChange } = props;
    const { touched, submitError, dirtySinceLastSubmit } = meta;
    const { name, value, onChange } = input;

    const error = meta.error || (!dirtySinceLastSubmit && submitError);
    const isErrorVisible = touched && !!error;

    const handleChange = useCallback(
        (value: string) => {
            onChange(value);
            onInputChange?.(value);
        },
        [onChange, onInputChange],
    );

    return (
        <div className={cn()}>
            <label></label>
            <div className={cn('options')}>
                {options?.map(({ label, value: optionValue, disabled }) => (
                    <label key={optionValue} className={cn('option', { active: value === optionValue, disabled })}>
                        <input
                            type='radio'
                            name={name}
                            disabled={disabled}
                            checked={value === optionValue}
                            value={optionValue}
                            onChange={event => !disabled && handleChange(event.target.value)}
                        />
                        {label}
                    </label>
                ))}
            </div>
            {isErrorVisible && <div className={cn('warning')}>{error}</div>}
        </div>
    );
};
