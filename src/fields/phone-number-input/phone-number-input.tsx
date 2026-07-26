import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import PhoneInput from 'react-phone-number-input';

import { classname } from '@utils';

import 'react-phone-number-input/style.css';
import './phone-number-input.scss';

type Props = {
    input: FieldRenderProps<string>['input'];
    meta: FieldRenderProps<string>['meta'];
    label: string;
    help: string;
    placeholder: string;
    required: boolean;
    className?: string;
    disabled?: boolean;
};

const cn = classname('phone-number-input');

export const PhoneNumberInput = (props: Props) => {
    const { input, meta, label, help, placeholder, required, className, disabled } = props;
    const { touched, submitError, dirtySinceLastSubmit } = meta;
    const { name } = input;

    const error = meta.error || (!dirtySinceLastSubmit && submitError);
    const isErrorVisible = touched && !!error;
    const helpText = (touched && error) || help;

    return (
        <div className={cn('', [className])}>
            <label className={cn('label')} htmlFor={name}>
                {required && <span className={cn('label-required')}>* </span>}
                {label}
            </label>
            <PhoneInput
                international={true}
                countryCallingCodeEditable={false}
                defaultCountry='US'
                className={cn('input', { warning: isErrorVisible, disabled })}
                {...input}
                placeholder={placeholder}
                disabled={disabled}
            />
            {helpText && <div className={cn('help', { warning: isErrorVisible })}>{helpText}</div>}
        </div>
    );
};
