import React, { ChangeEvent, useCallback } from 'react';

import { CheckIcon } from '@icons';
import { classname } from '@utils/classname';

import './checkbox-radio-button.scss';

type CheckboxRadioButtonProps = {
    name: string;
    label: string;
    value: string;
    checked?: boolean;
    id: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
};

const cn = classname('checkbox-radio-button');

export const CheckboxRadioButton = ({ id, name, label, onChange, value, checked, disabled = false }: CheckboxRadioButtonProps) => {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        },
        [onChange],
    );

    return (
        <label htmlFor={id} className={cn('', { checked, disabled })}>
            <input
                type='radio'
                id={id}
                name={name}
                value={value}
                checked={checked}
                disabled={disabled}
                onChange={handleChange}
                className={cn('checkbox', { checked, disabled })}
            />
            <CheckIcon className={cn('icon', { checked, disabled })} />
            <span className={cn('label')}>{label}</span>
        </label>
    );
};
