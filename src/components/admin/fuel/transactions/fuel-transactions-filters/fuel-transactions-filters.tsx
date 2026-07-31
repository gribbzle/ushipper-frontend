import React from 'react';
import { Field } from 'react-final-form';

import { AsyncDriverAccountsSelect, AsyncFuelCardsSelect, FuelCardCompaniesSelect, FuelTransactionStatusesSelect } from '@/components/common';
import { parseField } from '@/utils/parse-field';
import { FormControl, InputLabel } from '@fields';
import { translateByNamespace } from '@utils/i18n';

import { FuelFiltersPaper } from '../../fuel-filters-paper';

import { FuelTransactionsFiltersFormState } from './fuel-transactions-filters.types';
import { useFuelTransactionsFilters } from './use-fuel-transactions-filters';

const t = translateByNamespace('admin:fuel:filters');

export const FuelTransactionsFilters = () => {
    const { handleFiltersChange, initialValues } = useFuelTransactionsFilters();

    return (
        <FuelFiltersPaper<FuelTransactionsFiltersFormState>
            initialValues={initialValues}
            handleFiltersChange={handleFiltersChange}
            fields={
                <>
                    <FormControl>
                        <InputLabel>{t('fuel-card-field-label')}</InputLabel>
                        <Field<number> parse={value => value ?? null} name='cardId' component={AsyncFuelCardsSelect} />
                    </FormControl>
                    <FormControl>
                        <InputLabel>{t('company-field-label')}</InputLabel>
                        <Field parse={parseField} name='companyName' component={FuelCardCompaniesSelect} isMulti={false} />
                    </FormControl>
                    <FormControl>
                        <InputLabel>{t('driver-field-label')}</InputLabel>
                        <Field parse={parseField} name='accountId' component={AsyncDriverAccountsSelect} />
                    </FormControl>
                    <FormControl>
                        <InputLabel>{t('status-field-label')}</InputLabel>
                        <Field parse={parseField} name='statuses' component={FuelTransactionStatusesSelect} isMulti={false} />
                    </FormControl>
                </>
            }
        />
    );
};
