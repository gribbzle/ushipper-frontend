import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { SortBySelect } from '@/components/common/sort-by-select/sort-by-select';
import { Tabs } from '@/components/common/tabs/tabs';
import { Paper } from '@/components/common/paper/paper';
import { JobOfferSortingName } from '@/enums/offer-sorting-name';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { translateSortingOption } from '@utils/translations';

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
