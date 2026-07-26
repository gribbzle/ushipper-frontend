import React, { useCallback, useEffect, useState } from 'react';

import { classname } from '@utils';
const cn = classname('switch-input');

export type NativeSwitchProps = {
    label: string;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    className?: string;
    view?: 'primary-green';
    onChange?: (checked: boolean) => void;
};

export const NativeSwitch = ({ className, label, checked = false, disabled = false, onChange, view, ...rest }: NativeSwitchProps) => {
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = useCallback(() => {
        const state = !isChecked;

        setIsChecked(state);
        onChange?.(state);
    }, [isChecked, onChange]);

    return (
        <label className={cn('', { view }, [className])}>
            <input type='checkbox' {...rest} checked={isChecked} disabled={disabled} onChange={handleChange} />
            <span className={cn('control')}></span>
            <span className={cn('label', { disabled })}>{label}</span>
        </label>
    );
};
