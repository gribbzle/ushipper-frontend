import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {SelectField} from '@/fields/select-field';

import { useTermsSelectOptions } from './use-terms-select-options';

export const TermTypesSelect = ({
    label,
    input,
    showRequiredAsterisk = true,
    className,
    showOptionAll,
    valueAll,
    ...rest
}: FieldRenderProps<string> & {
    showRequiredAsterisk?: boolean;
    className?: string;
    showOptionAll?: boolean;
    valueAll?: any;
}) => {
    const options = useTermsSelectOptions(showOptionAll, valueAll);

    return (
        <FormControl className={className}>
            <InputLabel required={showRequiredAsterisk}>{label}</InputLabel>
            <Field label={label} component={SelectField} name={input.name} options={options} input={input} {...rest} />
        </FormControl>
    );
};
