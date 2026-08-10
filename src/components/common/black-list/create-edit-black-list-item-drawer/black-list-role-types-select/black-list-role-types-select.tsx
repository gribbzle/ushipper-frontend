import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {SelectField} from '@/fields/select-field';

import { useRoleTypesSelectOptions } from './use-black-list-role-types-select-options';

export const BlackListRoleTypesSelect = ({ label, input, className, ...rest }: FieldRenderProps<string> & { className?: string }) => {
    const roleTypesOptions = useRoleTypesSelectOptions();

    return (
        <FormControl className={className}>
            <InputLabel>{label}</InputLabel>
            <Field component={SelectField} name={input.name} options={roleTypesOptions} input={input} {...rest} />
        </FormControl>
    );
};
