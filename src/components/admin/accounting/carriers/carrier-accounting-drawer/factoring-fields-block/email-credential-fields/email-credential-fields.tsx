import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FieldsGroupWrapper } from '@/components/common';
import { FormControl, InputLabel, PasswordField, PasswordFieldProps, PrefixedField, TextField } from '@fields';
import { EmailServerCredentialType } from '@types';
import { translateByNamespace } from '@utils';
import { required } from '@validators';

type EmailCredentialsFieldsProps = {
    title: string;
    prefix: EmailServerCredentialType;
};

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:factoring');

export const EmailCredentialsFields = ({ title, prefix }: EmailCredentialsFieldsProps) => (
    <FieldsGroupWrapper title={title}>
        <FormControl>
            <InputLabel required={true}>{t('user-name')}</InputLabel>
            <PrefixedField name={`${prefix}.username`} component={TextField} placeholder='' validate={required} />
        </FormControl>
        <FormControl>
            <InputLabel required={true}>{t('password')}</InputLabel>
            <PrefixedField
                render={(props: FieldRenderProps<string> & PasswordFieldProps) => <PasswordField name={props.input.name} validate={required} placeholder='' />}
                name={`${prefix}.password`}
            />
        </FormControl>
        <FormControl>
            <InputLabel required={true}>{t('host')}</InputLabel>
            <PrefixedField name={`${prefix}.host`} component={TextField} placeholder='' validate={required} />
        </FormControl>
    </FieldsGroupWrapper>
);
