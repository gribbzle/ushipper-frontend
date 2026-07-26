import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { JobOfferSortingName, OrderSortingDirection } from '@/enums';
import { Paper, SortBySelect, Tabs } from '@components';
import { FormControl, InputLabel, TextField } from '@fields';
import { useMeCarrier } from '@hooks';
import { classname, FormValuesSpy, translateByNamespace, translateSortingOption } from '@utils';

import { JobOffersFiltersProps, JobOffersFiltersTypes } from './job-offers-filters.types';
import { useJobOffersFiltersTabs } from './job-offers-filters-tabs';
import { JobOffersSearchSubjectsSelect } from './job-offers-search-subjects-select';
import { TypeSelect } from './type-select';

import './job-offers-filters.scss';

const tOrderPageFilters = translateByNamespace('client:orders-page:filters');
const cn = classname('job-offers-filters');
const orderT = translateByNamespace('client:orders-page:filters');

export const JobOffersFilters = ({ offersStats, onSelectTab, onChangeFormValue }: JobOffersFiltersProps) => {
    const { tabs } = useJobOffersFiltersTabs(offersStats);
    const isMeCarrier = useMeCarrier();

    const initialValues = useMemo<JobOffersFiltersTypes>(
        () => ({
            type: isMeCarrier ? 'user_to_company' : 'company_to_user',
            sortBy: [
                {
                    group: 'orderName',
                    label: translateSortingOption('creation-date'),
                    value: 'created_at',
                },
                {
                    group: 'orderDirection',
                    label: translateSortingOption('desc'),
                    labelForInput: '(Z to A)',
                    value: OrderSortingDirection.DESC,
                },
            ],
        }),
        [isMeCarrier],
    );

    return (
        <Paper
            className={cn()}
            body={
                <div>
                    <Form<JobOffersFiltersTypes>
                        onSubmit={() => undefined}
                        subscription={{
                            values: true,
                        }}
                        initialValues={initialValues}
                        render={() => (
                            <form className={cn('form')}>
                                <FormValuesSpy onChange={onChangeFormValue} debounceTime={300} />
                                <FormControl>
                                    <InputLabel>{tOrderPageFilters('type')}</InputLabel>
                                    <Field name='type' component={TypeSelect} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{tOrderPageFilters('search-subject-field-label')}</InputLabel>
                                    <Field name='searchSubjects' component={JobOffersSearchSubjectsSelect} isMulti={true} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{tOrderPageFilters('search-field-label')}</InputLabel>
                                    <Field name='search' component={TextField} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{orderT('sort-by-field-label')}</InputLabel>
                                    <Field name='sortBy' component={SortBySelect} options={JobOfferSortingName} />
                                </FormControl>
                            </form>
                        )}
                    />
                    <Tabs classNames={cn('tabs')} tabs={tabs} onSelectTab={onSelectTab} />
                </div>
            }
        />
    );
};
