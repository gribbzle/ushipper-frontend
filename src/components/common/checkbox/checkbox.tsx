import React, { useCallback, useEffect, useState } from 'react';

import { classname } from '@utils';

import CheckIconDefault from './check-default.svg';
import CheckIconMini from './check-mini.svg';

import './checkbox.scss';

type CheckboxProps = {
    checked?: boolean;
    onChange?: (value: boolean) => void;
    size?: 'default' | 'mini';
    className?: string;
    disabled?: boolean;
};

const cn = classname('checkbox');

export const Checkbox = (props: CheckboxProps) => {
    const { size = 'default', checked, className, onChange, disabled = false } = props;
    const [value, setValue] = useState(checked);

    useEffect(() => setValue(checked), [checked]);

    const onChangeHandler = useCallback(() => {
        const newValue = !value;

        setValue(newValue);
        onChange?.(newValue);
    }, [onChange, value]);

    return (
        <label className={cn('', { checked: value, size, disabled }, [className])}>
            <input type='checkbox' checked={value} disabled={disabled} onChange={onChangeHandler} />
            {value && size === 'default' && <CheckIconDefault />}
            {value && size === 'mini' && <CheckIconMini />}
        </label>
    );
};
