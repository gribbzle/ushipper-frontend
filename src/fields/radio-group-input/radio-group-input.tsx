import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { RadioButtonGroup, RadioOption } from '@components';
import { classname } from '@utils';

import './radio-group-input.scss';

type RadioGroupInputProps = {
    input: FieldRenderProps<string>['input'];
    meta: FieldRenderProps<string>['meta'];
    label: string;
    options: RadioOption[];
    required?: boolean;
    className?: string;
    disabled?: boolean;
    view?: 'checkbox';
};

const cn = classname('radio-group-input');

export const RadioGroupInput = (props: RadioGroupInputProps) => {
    const { input, meta, label, options, className, required, disabled = false, view } = props;
    const { touched, submitError, dirtySinceLastSubmit } = meta;
    const { value, onChange, onBlur, name } = input;

    const error = meta.error || (!dirtySinceLastSubmit && submitError);
    const isErrorVisible = touched && !!error;

    const handleChange = useCallback(
        (newValue: string) => {
            onChange(newValue);
            onBlur();
        },
        [onBlur, onChange],
    );

    return (
        <div className={cn('', [className])}>
            <RadioButtonGroup
                onChange={handleChange}
                name={name}
                label={label}
                options={options}
                required={required}
                checkedValue={value}
                disabled={disabled}
                view={view}
            />
            {isErrorVisible && <div className={cn('error')}>{error}</div>}
        </div>
    );
};
