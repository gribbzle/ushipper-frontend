import React, { ChangeEvent, useCallback } from 'react';

import { classname } from '@utils';

import './selection-button.scss';

type SelectionButtonProps = {
    name: string;
    label: string;
    value: string;
    checked?: boolean;
    id: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
};

const cn = classname('selection-button');

export const SelectionButton = ({ id, name, label, onChange, value, checked, disabled = false }: SelectionButtonProps) => {
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (!disabled) {
                onChange?.(e.target.value);
            }
        },
        [disabled, onChange],
    );

    const handleClick = useCallback(() => {
        if (!disabled) {
            onChange?.(value);
        }
    }, [disabled, onChange, value]);

    return (
        <div className={cn('', { checked, disabled })} onClick={handleClick} role='button' tabIndex={0}>
            <input type='radio' id={id} name={name} value={value} checked={checked} onChange={handleChange} className={cn('input')} />
            <span className={cn('label')}>{label}</span>
        </div>
    );
};
