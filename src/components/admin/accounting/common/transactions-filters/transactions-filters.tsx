import React from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncCompanySelect, AsyncDriverAccountsSelect, AsyncUserSelect, Paper, TransactionTypeSelect } from '@/components/common';
import { DatePicker, FormControl, InputLabel, TextField } from '@fields';
import { TransactionsFiltersState } from '@types';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';

import { PaymentConfirmationTypeSelect } from './payment-confiramtion-type-select';
import { PaymentTypeSelect } from './payment-type-select';
import { TransactionStatusSelect } from './transaction-status-select';
import { useTransactionsFilters } from './use-transactions-filters';

import './transactions-filters.scss';

type TransactionsFiltersProps = {
    context: 'transactions' | 'factoring-balance' | 'ushipper-balance' | 'dispatch-balance' | 'cod-balance' | 'broker-fee-balance' | 'custom-balance';
};

const cn = classname('transactions-filters');
const t = translateByNamespace('admin:accounting:filters');

export const TransactionsFilters = ({ context }: TransactionsFiltersProps) => {
    const { initialValues, extraPaymentConfirmationOptions, handleFiltersChange } = useTransactionsFilters();
    const isTransactionContext = context === 'transactions';

    return (
        <Paper
            body={
                <Form<TransactionsFiltersState>
                    onSubmit={handleFiltersChange}
                    initialValues={initialValues}
                    render={({ handleSubmit }) => (
                        <form className={cn('')} onSubmit={handleSubmit}>
                            <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                            <FormControl>
                                <InputLabel>{t('order-id')}</InputLabel>
                                <Field parse={parseField} name='orderId' component={TextField} placeholder='' />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('date-start')}</InputLabel>
                                <Field parse={parseField} name='createdAtFrom' component={DatePicker} placeholder='' />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('date-end')}</InputLabel>
                                <Field parse={parseField} name='createdAtTo' component={DatePicker} placeholder='' />
                            </FormControl>
                            {!isTransactionContext && (
                                <>
                                    <FormControl>
                                        <InputLabel>{t('company')}</InputLabel>
                                        <Field parse={parseField} name='reasonCompanyId' component={AsyncCompanySelect} placeholder={t('all')} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('user')}</InputLabel>
                                        <Field parse={parseField} name='reasonUserId' component={AsyncUserSelect} placeholder={t('all')} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('transaction-type')}</InputLabel>
                                        <Field parse={parseField} name='fundsMovement' component={TransactionTypeSelect} placeholder={t('all')} />
                                    </FormControl>
                                </>
                            )}
                            {isTransactionContext && (
                                <>
                                    <FormControl>
                                        <InputLabel>{t('account')}</InputLabel>
                                        <Field parse={parseField} name='accountId' component={AsyncDriverAccountsSelect} placeholder={t('all')} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('transaction-type')}</InputLabel>
                                        <Field
                                            parse={parseField}
                                            name='type'
                                            component={PaymentConfirmationTypeSelect}
                                            placeholder={t('all')}
                                            additionalOptions={extraPaymentConfirmationOptions}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('payment-type')}</InputLabel>
                                        <Field parse={parseField} name='typeGroup' component={PaymentTypeSelect} placeholder={t('all')} />
                                    </FormControl>
                                </>
                            )}
                            <FormControl>
                                <InputLabel>{t('transaction-status')}</InputLabel>
                                <Field parse={parseField} name='status' component={TransactionStatusSelect} placeholder={t('all')} />
                            </FormControl>
                        </form>
                    )}
                />
            }
        />
    );
};
