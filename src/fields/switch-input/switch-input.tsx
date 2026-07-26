import React, { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FormControl, FormHelperText } from '@/fields';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { classname } from '@utils';

import './switch-input.scss';

const cn = classname('switch-input');

type SwitchInputProps = FieldRenderProps<boolean> & {
    onAfterChange?: (checked: boolean) => void;
    formControlClassName?: string;
};

export const SwitchInput = ({ input, meta, label, disabled, className, onAfterChange, formControlClassName }: SwitchInputProps) => {
    const handleChange = useCallback(
        (checked: boolean) => {
            input.onChange(checked);
            onAfterChange?.(checked);
        },
        [input, onAfterChange],
    );

    return (
        <FormControl className={formControlClassName}>
            <NativeSwitch className={cn('', [className])} label={label} name={input.name} checked={input.value} onChange={handleChange} disabled={disabled} />
            {meta.error && meta.touched && <FormHelperText error={true}>{meta.error}</FormHelperText>}
        </FormControl>
    );
};
