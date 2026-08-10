import React from 'react';
import { Field, Form } from 'react-final-form';

import { AlertStatusSelect } from '@/components/common/selects/alert-status-select/alert-status-select';
import { AlertTypeSelect } from '@/components/common/selects/alert-type-select/alert-type-select';
import { Paper } from '@/components/common/paper/paper';
import { FormControl, InputLabel } from '@fields';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';

import { AlertsFiltersFormState } from './alerts-filters.types';
import { useAlertsFilters } from './use-alerts-filters';

import './alerts-filters.scss';

const t = translateByNamespace('admin:accounting:filters');
const cn = classname('alerts-filters');

export const AlertsFilters = () => {
    const { initialValues, handleFiltersChange } = useAlertsFilters();

    return (
        <Paper
            body={
                <Form<AlertsFiltersFormState>
                    onSubmit={handleFiltersChange}
                    initialValues={initialValues}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className={cn()}>
                            <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                            {/* // TODO hide until back is ready
                            <FormControl>
                                <InputLabel>{t('order-id')}</InputLabel>
                                <Field parse={parseField} name='orderId' component={TextField} placeholder='' />
                            </FormControl> */}

                            <FormControl>
                                <InputLabel>{t('alert-type')}</InputLabel>
                                <Field parse={parseField} name='types' component={AlertTypeSelect} placeholder={t('all')} isMulti={false} />
                            </FormControl>

                            <FormControl>
                                <InputLabel>{t('alert-status')}</InputLabel>
                                <Field parse={parseField} name='statuses' component={AlertStatusSelect} placeholder={t('all')} isMulti={false} />
                            </FormControl>
                        </form>
                    )}
                />
            }
        />
    );
};
