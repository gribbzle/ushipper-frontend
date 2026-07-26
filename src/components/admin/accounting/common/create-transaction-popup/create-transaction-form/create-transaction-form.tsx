import React from 'react';
import { Field, Form } from 'react-final-form';

import { TransactionTypesEnum } from '@/enums';
import { CurrencyInput, FormControl, InputLabel, TextField } from '@fields';
import { classname, isFreightX, translateByNamespace } from '@utils';
import { required } from '@validators';

import { WalletsSelect } from '../../wallets-select';
import { TransactionTypeSelectionButtonGroup } from '../transaction-type-selection-button-group';

import { CreateTransactionFormProps, CreateTransactionFormState } from './create-transaction-form.types';
import { useCreateTransactionForm } from './use-create-transaction-form';

import './create-transaction-form.scss';

const t = translateByNamespace('admin:accounting:factoring-balance:create-transaction-popup:form');
const cn = classname('create-transaction-form');

export const CreateTransactionForm = ({ formRef, context, disabledSourceWallet = true, onAfterSubmit }: CreateTransactionFormProps) => {
    const { isInternalUserContext, initialValues, onSubmit, handleTypeChange } = useCreateTransactionForm({
        formRef,
        onAfterSubmit,
        context,
        disabledSourceWallet,
    });

    return (
        <Form<CreateTransactionFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form, values }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <InputLabel required={true}>{t('amount')}</InputLabel>
                            <Field name='amount' parse={value => value} component={CurrencyInput} startAdornment='$' validate={required} placeholder='' />
                        </FormControl>
                        <FormControl className={cn('type')}>
                            <InputLabel>{t('type')}</InputLabel>
                            <TransactionTypeSelectionButtonGroup name='type' validate={required} callback={handleTypeChange} context={context} />
                        </FormControl>
                        <FormControl className={cn('account')}>
                            <InputLabel required={isInternalUserContext}>{t('from-account')}</InputLabel>
                            <Field
                                name='sourceBalanceId'
                                component={WalletsSelect}
                                validate={isInternalUserContext ? required : undefined}
                                hasExternalCardWallets={false}
                                onlyCustomInternalWallets={isInternalUserContext && isFreightX && values?.destinationBalanceId}
                                disabled={disabledSourceWallet && values.type === TransactionTypesEnum.OUTGOING}
                                parse={value => value}
                                placeholder=''
                            />
                        </FormControl>
                        <FormControl className={cn('account')}>
                            <InputLabel required={isInternalUserContext}>{t('to-account')}</InputLabel>
                            <Field
                                name='destinationBalanceId'
                                component={WalletsSelect}
                                validate={isInternalUserContext ? required : undefined}
                                hasExternalCardWallets={true}
                                disabled={disabledSourceWallet && values.type === TransactionTypesEnum.INCOMING}
                                onlyCustomInternalWallets={isInternalUserContext && isFreightX && values?.sourceBalanceId}
                                parse={value => value}
                                placeholder=''
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('notes')}</InputLabel>
                            <Field name='notes' component={TextField} multiline={true} resize='none' validate={required} parse={value => value} />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
