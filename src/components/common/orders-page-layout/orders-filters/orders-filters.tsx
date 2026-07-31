import React, { memo, useCallback, useEffect, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { DispatchersSelect } from '@/components/common/dispatchers-select/dispatchers-select';
import { SearchSubjectsSelect } from '@/components/common/search-subjects-select/search-subjects-select';
import { SortBySelect } from '@/components/common/sort-by-select/sort-by-select';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { OrderSortingName } from '@/enums';
import { FormControl, InputLabel, TextField } from '@fields';
import { useMeCarrier, useMeDriverRelated } from '@hooks';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { DriverAccountsSelect } from '../driver-accounts-select';
import { useOrdersFiltersChange, useOrdersSortingFieldOptions } from '../hooks';

import { FiltersTabs, OrdersFilterTab } from './filters-tabs';
import { OrdersFiltersFormState, OrdersFiltersProps } from './orders-filters.types';
import { getFiltersFromFormValue } from './utils';

import './orders-filters.scss';

const cn = classname('orders-filters');
const t = translateByNamespace('client:orders-page:filters');

export const OrdersFilters = memo(
    ({ initialFilters, initialStatusFilter, onFiltersChange, onTabFilterClick, hideTabs, statisticsCounters }: OrdersFiltersProps) => {
        const isFirstRenderRef = useRef(true);
        const formRef = useRef<FormApi<OrdersFiltersFormState>>();

        const isMeCarrier = useMeCarrier();
        const isDriver = useMeDriverRelated();

        const sortingFieldOptions = useOrdersSortingFieldOptions();

        const onOrdersFiltersChange = useOrdersFiltersChange(onFiltersChange);

        const handleFiltersChange = useCallback(
            (values: OrdersFiltersFormState) => {
                if (isFirstRenderRef.current) {
                    isFirstRenderRef.current = false;

                    return;
                }

                onOrdersFiltersChange(getFiltersFromFormValue(values));
            },
            [onOrdersFiltersChange],
        );

        const handleFormSubmit = useCallback(() => undefined, []);

        const handleTabFilterClick = useCallback(
            (tab: OrdersFilterTab) => {
                isFirstRenderRef.current = true;
                onTabFilterClick(tab.value);
            },
            [onTabFilterClick],
        );

        useEffect(() => {
            if (formRef.current) {
                const formState: OrdersFiltersFormState = {
                    dispatchers: initialFilters.dispatchers || [],
                    driverAccountId: initialFilters.driverAccountId || [],
                };

                if (initialFilters.search) {
                    formState.search = initialFilters.search;
                }

                if (initialFilters.searchSubject) {
                    formState.searchSubject = initialFilters.searchSubject;
                }

                if (initialFilters.orderName && initialFilters.orderDirection && sortingFieldOptions.length) {
                    const orderNameOption = sortingFieldOptions[0].options.find(option => option.value === initialFilters.orderName);
                    const orderDirectionOption = sortingFieldOptions[1].options.find(option => option.value === initialFilters.orderDirection);

                    if (orderNameOption && orderDirectionOption) {
                        formState.sortBy = [orderNameOption, orderDirectionOption];
                    }
                }

                if (!initialFilters.orderName && !initialFilters.orderDirection && sortingFieldOptions.length) {
                    formState.sortBy = [sortingFieldOptions[0].options[0], sortingFieldOptions[1].options[0]];
                }
                formRef.current?.reset(formState);
            }
        }, []);

        return (
            <Paper
                className={cn()}
                body={
                    <>
                        <Form<OrdersFiltersFormState>
                            onSubmit={handleFormSubmit}
                            subscription={{
                                values: true,
                            }}
                            initialValues={{}}
                            render={({ handleSubmit, form }) => {
                                formRef.current = form;

                                return (
                                    <form className={cn('form')} onSubmit={handleSubmit}>
                                        <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                                        <FormControl>
                                            <InputLabel>{t('search-subject-field-label')}</InputLabel>
                                            <Field name='searchSubject' component={SearchSubjectsSelect} />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel>{t('search-field-label')}</InputLabel>
                                            <Field name='search' component={TextField} />
                                        </FormControl>
                                        {(isMeCarrier || isDriver) && (
                                            <>
                                                <FormControl>
                                                    <InputLabel>{t('drivers-field-label')}</InputLabel>
                                                    <Field name='driverAccountId' component={DriverAccountsSelect} isClearable={true} />
                                                </FormControl>
                                                {!isDriver && (
                                                    <FormControl>
                                                        <InputLabel>{t('dispatchers-field-label')}</InputLabel>
                                                        <Field name='dispatchers' component={DispatchersSelect} isClearable={true} />
                                                    </FormControl>
                                                )}
                                            </>
                                        )}
                                        <FormControl>
                                            <InputLabel>{t('sort-by-field-label')}</InputLabel>
                                            <Field name='sortBy' component={SortBySelect} options={OrderSortingName} />
                                        </FormControl>
                                    </form>
                                );
                            }}
                        />
                        {!hideTabs && (
                            <FiltersTabs
                                statisticsCounters={statisticsCounters}
                                onTabClick={handleTabFilterClick}
                                initialFilterTabValue={initialStatusFilter}
                            />
                        )}
                    </>
                }
            />
        );
    },
);

OrdersFilters.displayName = 'OrdersFilters';
