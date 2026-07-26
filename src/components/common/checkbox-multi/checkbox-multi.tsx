import React from 'react';

import { SelectOption } from '@/shared';
import { classname } from '@utils';

import { CheckboxOption } from './checkbox-option';

import './checkbox-multi.scss';

type CheckboxMultiSelectProps<T> = {
    name: string;
    onChange?: (value: T) => void;
    options: SelectOption<T>[];
    disabled?: boolean;
    checkedValues?: T[];
};

const cn = classname('checkbox-multi');

export function CheckboxMultiSelect<T>({ options, onChange, checkedValues = [], disabled = false, name }: CheckboxMultiSelectProps<T>) {
    return (
        <div className={cn()}>
            {options.map(({ label, value }) => {
                const shortenedOptionLabel = label.replace(/\s+/g, '');
                const optionId = `checkbox-option-${shortenedOptionLabel}-${value}`;

                return (
                    <CheckboxOption
                        key={optionId}
                        label={label}
                        value={value}
                        id={optionId}
                        name={name}
                        onChange={onChange}
                        checked={checkedValues?.includes(value)}
                        disabled={disabled}
                    />
                );
            })}
        </div>
    );
}
