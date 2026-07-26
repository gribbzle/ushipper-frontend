import React from 'react';
import { Field, Form } from 'react-final-form';

import { Paper } from '@/components/common';
import { FormControl, InputLabel, TextField } from '@fields';
import { BalanceAmountType } from '@store/admin';
import { classname, FormValuesSpy, parseField, translateByNamespace } from '@utils';

import { useWalletsFilters } from './use-wallets-filters';
import { WalletAmountTypeSelect } from './wallet-amount-type-select';
import { WalletTypeSelect } from './wallet-type-select';

import './wallets-filters.scss';

export type WalletsFiltersFormState = {
    search: string;
    balanceAmountType: BalanceAmountType;
    type: 'custom' | 'system';
};

const t = translateByNamespace('admin:accounting:wallets-page:filters');
const tAll = translateByNamespace('admin:accounting:filters');

const cn = classname('wallets-filters');

export const WalletsFilters = () => {
    const { initialValues, handleFiltersChange } = useWalletsFilters();

    return (
        <Paper
            body={
                <Form<WalletsFiltersFormState>
                    onSubmit={handleFiltersChange}
                    initialValues={initialValues}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className={cn()}>
                            <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />

                            <FormControl>
                                <InputLabel>{t('wallet-name-label')}</InputLabel>
                                <Field parse={parseField} name='search' component={TextField} placeholder='' />
                            </FormControl>

                            <FormControl>
                                <InputLabel>{t('type-label')}</InputLabel>
                                <Field parse={parseField} name='type' component={WalletTypeSelect} placeholder={tAll('all')} isMulti={false} />
                            </FormControl>

                            <FormControl>
                                <InputLabel>{t('amount-type-label')}</InputLabel>
                                <Field
                                    parse={parseField}
                                    name='balanceAmountType'
                                    component={WalletAmountTypeSelect}
                                    placeholder={tAll('all')}
                                    isMulti={false}
                                />
                            </FormControl>
                        </form>
                    )}
                />
            }
        />
    );
};
