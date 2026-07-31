import React, { useCallback, useEffect, useState } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SortSelect, SortSelectOptions, SortSelectValue } from '@/components/common/sort-select/sort-select';
import { classname } from '@utils/classname';

import './sort-select-input.scss';

type SortSelectInputProps = {
    input: FieldRenderProps<SortSelectValue>['input'];
    meta: FieldRenderProps<SortSelectValue>['meta'];
    label?: string;
    choice: SortSelectOptions | [];
    className?: string;
    onChange?: (values: SortSelectValue) => void;
    closeMenuOnSelect?: boolean;
};

const cn = classname('select-input');

export const SortSelectInput = (props: SortSelectInputProps) => {
    const { label, input, choice, className, closeMenuOnSelect } = props;
    const { value, onChange, onFocus, onBlur, name } = input;
    const [parsedValue, setParsedValue] = useState<SortSelectValue | null>(value);

    const onChangeHandler = useCallback(
        (selectedValues: SortSelectValue) => {
            onChange(selectedValues);
            onBlur();
            props?.onChange?.(selectedValues);
        },
        [onBlur, onChange, props],
    );

    useEffect(() => {
        if (!value) {
            setParsedValue(null);

            return;
        }

        if (value.every(v => v.label)) {
            setParsedValue(value);

            return;
        }

        const newValue = value.map(v => {
            return choice[0]?.options.find(o => o.value === v.value) || choice[1]?.options.find(o => o.value === v.value) || v;
        }) as SortSelectValue;

        setParsedValue(newValue);
    }, [value, choice]);

    return (
        <div className={cn('', [className])} data-test-id={name}>
            {label && (
                <label htmlFor={name} className={cn('label')}>
                    {label}
                </label>
            )}
            <SortSelect
                value={parsedValue}
                name={name}
                options={choice}
                onChange={onChangeHandler}
                onFocus={onFocus}
                onBlur={onBlur}
                closeMenuOnSelect={closeMenuOnSelect}
            />
        </div>
    );
};
