import React from 'react';

import { FieldsGroupWrapper } from '@/components/common';
import { ExternalServiceType } from '@enums';
import { FieldPrefix, FormControl, InputLabel, PrefixedField, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, emailValidator, required } from '@validators';

import { EMAIL_SERVER_TYPES } from '../constants';
import { getExternalServiceFieldPrefix } from '../utils';

import { AutoSendFactoringRequestSwitch } from './auto-send-factoring-request-switch';
import { AutoTransferFundsOnApprovalSwitch } from './auto-transfer-funds-on-approval-switch';
import { EmailCredentialsFields } from './email-credential-fields';
import { FactoringProviderSelect } from './factoring-provider-select';

import './factoring-fields-block.scss';

const cn = classname('factoring-fields-block');
const t = translateByNamespace('admin:accounting:carrier-accounting-drawer:factoring');

export const FactoringFieldsBlock = () => (
    <FieldPrefix prefix={getExternalServiceFieldPrefix(ExternalServiceType.FACTORING_EMAILS)}>
        <div className={cn()}>
            <FieldsGroupWrapper title={t('settings')}>
                <FormControl>
                    <InputLabel required={true}>{t('factoring-provider')}</InputLabel>
                    <PrefixedField component={FactoringProviderSelect} placeholder='' validate={required} name='driver' disabled={true} />
                </FormControl>
                <FormControl className={cn('first-column')}>
                    <InputLabel required={true}>{t('outgoing-email')}</InputLabel>
                    <PrefixedField name='outgoingEmail' component={TextField} placeholder='' validate={composeValidators(required, emailValidator)} />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('incoming-email')}</InputLabel>
                    <PrefixedField name='incomingEmail' component={TextField} placeholder='' validate={composeValidators(required, emailValidator)} />
                </FormControl>
            </FieldsGroupWrapper>
            {EMAIL_SERVER_TYPES.map(type => (
                <EmailCredentialsFields key={type} title={t(type)} prefix={type} />
            ))}
            <AutoSendFactoringRequestSwitch />
            <AutoTransferFundsOnApprovalSwitch />
        </div>
    </FieldPrefix>
);
