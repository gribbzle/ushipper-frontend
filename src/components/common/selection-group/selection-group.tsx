import React, { useCallback, useState } from 'react';

import { classname } from '@utils/classname';

import { SelectionGroupProps } from './selection-group.types';

import './selection-group.scss';

const cn = classname('selection-group');

export const SelectionGroup = <T extends string>({ items, defaultValue, onChange }: SelectionGroupProps<T>) => {
    const [value, setValue] = useState<T | undefined>(defaultValue);

    const handleClick = useCallback(
        (item: T) => {
            setValue(item);
            onChange(item);
        },
        [onChange],
    );

    return (
        <div className={cn('')}>
            {items.map(item => (
                <button className={cn('item', { active: item.value === value })} type='button' key={item.value} onClick={() => handleClick(item.value)}>
                    {item.icon} {item.value}
                </button>
            ))}
        </div>
    );
};
