import React from 'react';
import { Field, Form } from 'react-final-form';

import { Paper } from '@/components/common/paper/paper';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';

import { useWalletsFilters } from './use-wallets-filters';
import { WalletAmountTypeSelect } from './wallet-amount-type-select';
import { WalletTypeSelect } from './wallet-type-select';
import { WalletsFiltersFormState } from './wallets-filters.types';

import './wallets-filters.scss';

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
