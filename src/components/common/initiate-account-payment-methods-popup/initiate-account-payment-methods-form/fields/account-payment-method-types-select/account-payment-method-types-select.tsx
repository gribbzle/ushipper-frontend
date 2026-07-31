import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectField } from '@fields';
import { AccountPaymentMethod } from '@store/api/accounts-api';
import { translateByNamespace } from '@utils/i18n';

const ACCOUNT_PAYMENT_METHODS: readonly AccountPaymentMethod[] = ['masspay', 'fluidpay'] as const;

const t = translateByNamespace('admin:accounting:initiate-account-payment-methods-popup:payment-methods-type');

export const AccountPaymentMethodTypesSelect = (props: FieldRenderProps<string>) => {
    const options = ACCOUNT_PAYMENT_METHODS.map(method => ({
        label: t(method),
        value: method,
    }));

    return <SelectField options={options} {...props} isMulti={props.isMulti} />;
};
