import React, { ChangeEvent, useCallback } from 'react';

import { classname } from '@utils';

import './radio-button.scss';

type RadioButtonProps = {
    name: string;
    label: string;
    value: string;
    description?: string;
    checked?: boolean;
    id: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
};

const cn = classname('radio-button');

export const RadioButton = ({ id, name, label, description, onChange, value, checked, disabled = false }: RadioButtonProps) => {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        },
        [onChange],
    );

    return (
        <div className={cn()}>
            <input className={cn('control')} type='radio' id={id} disabled={disabled} onChange={handleChange} name={name} value={value} checked={checked} />
            <label className={cn('label-container')} htmlFor={id}>
                <span className={cn('label')}>{label}</span>
                <span className={cn('description')}>{description}</span>
            </label>
        </div>
    );
};
