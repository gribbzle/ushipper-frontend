import React from 'react';
import { Field, Form } from 'react-final-form';

import {CurrencyInput} from '@/fields/currency-input';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { UserExternalWalletsSelect } from '../user-external-wallets-select';

import { CashOutTransactionFormProps, CashOutTransactionFormState } from './cash-out-transaction-form.types';
import { useCashOutTransactionForm } from './use-cash-out-transaction-form';

import './cash-out-transaction-form.scss';

const t = translateByNamespace('client:wallet-page:cash-out-transaction-popup');
const cn = classname('cash-out-transaction-form');

export const CashOutTransactionForm = ({ formRef, onAfterSubmit }: CashOutTransactionFormProps) => {
    const { onSubmit, accountId } = useCashOutTransactionForm({ onAfterSubmit });

    return (
        <Form<CashOutTransactionFormState>
            subscription={{ values: true }}
            initialValues={{}}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <InputLabel required={true}>{t('amount')}</InputLabel>
                            <Field name='amount' parse={value => value} component={CurrencyInput} startAdornment='$' validate={required} placeholder='' />
                        </FormControl>

                        <FormControl className={cn('account')}>
                            <InputLabel required={true}>{t('to-financial-account')}</InputLabel>
                            <Field
                                name='destinationBalanceId'
                                component={UserExternalWalletsSelect}
                                validate={required}
                                parse={value => value}
                                placeholder=''
                                accountId={accountId}
                            />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
