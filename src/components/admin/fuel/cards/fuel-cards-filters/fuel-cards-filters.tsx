import React from 'react';
import { Field } from 'react-final-form';

import { AsyncDriverAccountsSelect } from '@/components/common/selects/async-driver-accounts-select/async-driver-accounts-select';
import { FuelCardCompaniesSelect } from '@/components/common/selects/fuel/fuel-card-companies-select/fuel-card-companies-select';
import { FuelCardStatusesSelect } from '@/components/common/selects/fuel/fuel-card-statuses-select/fuel-card-statuses-select';
import { parseField } from '@/utils/parse-field';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { translateByNamespace } from '@utils/i18n';

import { FuelFiltersPaper } from '../../fuel-filters-paper';

import { FuelCardsFiltersFormState } from './fuel-cards-filters.types';
import { useFuelCardsFilters } from './use-fuel-cards-filters';

const t = translateByNamespace('admin:fuel:filters');

export const FuelCardsFilters = () => {
    const { handleFiltersChange, initialValues } = useFuelCardsFilters();

    return (
        <FuelFiltersPaper<FuelCardsFiltersFormState>
            initialValues={initialValues}
            handleFiltersChange={handleFiltersChange}
            fields={
                <>
                    <FormControl>
                        <InputLabel>{t('number-field-label')}</InputLabel>
                        <Field parse={parseField} name='number' component={TextField} placeholder='' />
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
                        <Field parse={parseField} name='statuses' component={FuelCardStatusesSelect} isMulti={false} />
                    </FormControl>
                </>
            }
        />
    );
};
