import React, { useCallback } from 'react';

import { classname } from '@utils';

type CheckboxOptionProps = {
    name: string;
    label: string;
    value: any;
    checked?: boolean;
    id: string;
    onChange?: (value: any) => void;
    disabled?: boolean;
};

const cn = classname('checkbox-multi');

export const CheckboxOption = ({ id, name, label, onChange, value, checked, disabled = false }: CheckboxOptionProps) => {
    const handleChange = useCallback(() => onChange?.(value), [onChange, value]);

    return (
        <div>
            <input type='checkbox' id={id} disabled={disabled} onChange={handleChange} name={name} value={value} checked={checked} />
            <label className={cn('option', { checked })} htmlFor={id}>
                {label}
            </label>
        </div>
    );
};
