import React from 'react';
import { Field, Form } from 'react-final-form';

import { AlertStatusSelect, AlertTypeSelect, Paper } from '@/components/common';
import { IssueStatus, IssueType } from '@enums';
import { FormControl, InputLabel } from '@fields';
import { classname, FormValuesSpy, parseField, translateByNamespace } from '@utils';

import { useAlertsFilters } from './use-alerts-filters';

import './alerts-filters.scss';

export type AlertsFiltersFormState = {
    orderId: string;
    statuses: IssueStatus[];
    types: IssueType[];
};

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
