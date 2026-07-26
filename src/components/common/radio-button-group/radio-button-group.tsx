import React from 'react';

import { RadioButton } from '@components';
import { classname } from '@utils';

import { CheckboxRadioButton } from '../checkbox-radio-button';

import './radio-button-group.scss';

export type RadioOption = {
    label: string;
    description?: string;
    value: string;
};

type RadioButtonGroupProps = {
    name: string;
    label?: string;
    required?: boolean;
    options: RadioOption[];
    onChange?: (value: string) => void;
    checkedValue?: string;
    disabled?: boolean;
    view?: 'checkbox';
};

const cn = classname('radio-button-group');

export const RadioButtonGroup = ({ label, options, name, onChange, required, checkedValue, disabled = false, view }: RadioButtonGroupProps) => {
    return (
        <fieldset className={cn()}>
            {label && (
                <legend className={cn('group-label')}>
                    {required && <span className={cn('group-label-required')}>* </span>}
                    {label}
                </legend>
            )}
            <div className={cn('options-wrapper')}>
                {options.map(({ label, description, value }) => {
                    const shortenedOptionLabel = label.replace(/\s+/g, '');
                    const optionId = `radio-option-${name}-${shortenedOptionLabel}`;

                    return view === 'checkbox' ? (
                        <CheckboxRadioButton
                            key={optionId}
                            label={label}
                            value={value}
                            id={optionId}
                            name={name}
                            onChange={onChange}
                            checked={checkedValue === value}
                            disabled={disabled}
                        />
                    ) : (
                        <RadioButton
                            key={optionId}
                            label={label}
                            value={value}
                            id={optionId}
                            name={name}
                            onChange={onChange}
                            description={description}
                            checked={checkedValue === value}
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        </fieldset>
    );
};
