import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { FieldsGroupWrapper } from '@/components/common/fields-group-wrapper/fields-group-wrapper';
import { SaveButton } from '@/components/common/button/SaveButton';
import { ExternalServiceType } from '@enums';
import { FieldPrefix, FormControl, InputLabel, PasswordField, PasswordFieldProps, PrefixedField, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';
import { composeValidators, emailValidator, required } from '@validators';

import { getExternalServiceFieldPrefix } from '../../utils';

import { useSuperDispatchFields } from './use-super-dispatch-fields';

import './super-dispatch-fields.scss';

const cn = classname('super-dispatch-fields');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:super-dispatch-fields');

export const SuperDispatchFields = () => {
    const { handleSuperDispatchLoginClick, handleSuperDispatchSettingsClick, hasVerificationCodeField, email } = useSuperDispatchFields();

    return (
        <FieldsGroupWrapper
            title={t('title')}
            actions={
                hasVerificationCodeField ? (
                    <SaveButton onClick={handleSuperDispatchSettingsClick} />
                ) : (
                    <Button view='primary' onClick={handleSuperDispatchLoginClick}>
                        {t('log-in-super-dispatch-btn-label')}
                    </Button>
                )
            }
        >
            <FieldPrefix prefix={getExternalServiceFieldPrefix(ExternalServiceType.SUPER_DISPATCH)}>
                <FormControl>
                    <InputLabel required={true}>{t('login-label')}</InputLabel>
                    <PrefixedField name='login' component={TextField} placeholder='' validate={composeValidators(required, emailValidator)} />
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
                {hasVerificationCodeField && (
                    <>
                        <AlertBlock className={cn('alert')} view='default'>
                            {renderTextWithBreakLines(t('alert', { email }))}
                        </AlertBlock>
                        <FormControl className={cn('code')}>
                            <InputLabel required={true}>{t('verification-code-label')}</InputLabel>
                            <PrefixedField name='code' component={TextField} placeholder='' validate={required} />
                        </FormControl>
                    </>
                )}
            </FieldPrefix>
        </FieldsGroupWrapper>
    );
};
