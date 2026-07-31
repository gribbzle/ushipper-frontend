import React from 'react';
import { Field, Form } from 'react-final-form';

import { Paper } from '@/components/common/paper/paper';
import { TransactionTypeSelect } from '@/components/common/transaction-type-select/transaction-type-select';
import { DatePicker, FormControl, InputLabel } from '@fields';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';

import { useWalletFilters } from './use-wallet-filters';
import { WalletFiltersState } from './wallet-filters.types';

import './wallet-filters.scss';

const cn = classname('wallet-filters');
const t = translateByNamespace('client:wallet-page:filters');

export const WalletFilters = () => {
    const { initialValues, handleFiltersChange } = useWalletFilters();

    return (
        <Paper
            body={
                <Form<WalletFiltersState>
                    onSubmit={handleFiltersChange}
                    initialValues={initialValues}
                    render={({ handleSubmit }) => (
                        <form className={cn('')} onSubmit={handleSubmit}>
                            <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                            <FormControl>
                                <InputLabel>{t('date-start')}</InputLabel>
                                <Field parse={parseField} name='createdAtFrom' component={DatePicker} placeholder='' />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('date-end')}</InputLabel>
                                <Field parse={parseField} name='createdAtTo' component={DatePicker} placeholder='' />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('transaction-type')}</InputLabel>
                                <Field parse={parseField} name='fundsMovement' component={TransactionTypeSelect} placeholder={t('all')} />
                            </FormControl>
                        </form>
                    )}
                />
            }
        />
    );
};
