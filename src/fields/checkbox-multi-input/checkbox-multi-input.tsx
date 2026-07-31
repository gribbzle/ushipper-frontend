import React, { useCallback, useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { CheckboxMultiSelect } from '@/components/common/checkbox-multi/checkbox-multi';
import { SelectOption } from '@/shared';
import { classname } from '@utils/classname';

import { FormHelperText } from '../form-helper-text';

import './checkbox-multi-input.scss';

type CheckboxMultiSelectInputProps<T> = FieldRenderProps<T[]> & {
    options: SelectOption<T>[];
    className?: string;
};

const cn = classname('checkbox-multi-input');

export function CheckboxMultiSelectInput<T>(props: CheckboxMultiSelectInputProps<T>) {
    const { input, meta, options, className } = props;
    const { value, onChange, onBlur, name } = input;

    const isErrorVisible = useMemo(() => meta.error && meta.touched, [meta.error, meta.touched]);

    const handleChange = useCallback(
        (optionValues: T) => {
            const newValues = value.includes(optionValues) ? value.filter(val => val !== optionValues) : [...value, optionValues];

            onChange(newValues);
            onBlur();
        },
        [value, onBlur, onChange],
    );

    const checkedValues = useMemo(() => input.value, [input.value]);

    return (
        <div className={cn('', [className])}>
            <CheckboxMultiSelect onChange={handleChange} name={name} options={options} checkedValues={checkedValues} />
            {isErrorVisible && <FormHelperText error={true}>{meta.error || meta.submitError}</FormHelperText>}
        </div>
    );
}
