import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectionButtonGroup, SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { classname } from '@utils/classname';

import './selection-button-group-input.scss';

type SelectButtonGroupInputProps = {
    input: FieldRenderProps<string>['input'];
    meta: FieldRenderProps<string>['meta'];
    options: SelectionButtonOption[];
    className?: string;
    disabled?: boolean;
    callback?: (value: any) => void;
};

const cn = classname('selection-button-group-input');

export const SelectionButtonGroupInput = (props: SelectButtonGroupInputProps) => {
    const { input, meta, options, className, disabled = false, callback } = props;
    const { touched, submitError, dirtySinceLastSubmit } = meta;
    const { value, onChange, onBlur, name } = input;

    const error = meta.error || (!dirtySinceLastSubmit && submitError);
    const isErrorVisible = touched && !!error;

    const handleChange = useCallback(
        (newValue: string) => {
            onChange(newValue);
            onBlur();
            callback?.(newValue);
        },
        [onBlur, onChange, callback],
    );

    return (
        <div className={cn('', { error: isErrorVisible }, [className])}>
            <SelectionButtonGroup onChange={handleChange} name={name} options={options} checkedValue={value} disabled={disabled} />
            {isErrorVisible && <div className={cn('error')}>{error}</div>}
        </div>
    );
};
