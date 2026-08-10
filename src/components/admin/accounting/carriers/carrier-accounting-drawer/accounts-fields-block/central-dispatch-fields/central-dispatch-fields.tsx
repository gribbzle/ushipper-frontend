import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FieldsGroupWrapper } from '@/components/common/fields-group-wrapper/fields-group-wrapper';
import { SaveButton } from '@/components/common/button/SaveButton';
import { ExternalServiceType } from '@enums';
import { FieldPrefix, FormControl, InputLabel, PasswordField, PasswordFieldProps, PrefixedField, TextField } from '@fields';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { getExternalServiceFieldPrefix } from '../../utils';

import { useCentralDispatchFields } from './use-central-dispatch-fields';

const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:central-dispatch-fields');

export const CentralDispatchFields = () => {
    const { handleCentralDispatchSubmitClick } = useCentralDispatchFields();

    return (
        <FieldsGroupWrapper title={t('title')} actions={<SaveButton onClick={handleCentralDispatchSubmitClick} />}>
            <FieldPrefix prefix={getExternalServiceFieldPrefix(ExternalServiceType.CENTRAL_DISPATCH)}>
                <FormControl>
                    <InputLabel required={true}>{t('login-label')}</InputLabel>
                    <PrefixedField name='login' component={TextField} placeholder='' validate={required} />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('password-label')}</InputLabel>
                    <PrefixedField
                        render={(props: FieldRenderProps<string> & PasswordFieldProps) => (
                            <PasswordField name={props.input.name} validate={required} placeholder='' />
                        )}
                        name='password'
                    />
                </FormControl>
            </FieldPrefix>
        </FieldsGroupWrapper>
    );
};
