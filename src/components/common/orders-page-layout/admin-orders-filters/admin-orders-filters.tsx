import React, { memo } from 'react';
import { Field, Form } from 'react-final-form';

import {
    AsyncCompanySelect,
    DispatchersSelect,
    FundsTransferCalculatedStatusSelect,
    Paper,
    ReceiptStatusSelect,
    SearchSubjectsSelect,
    SortBySelect,
} from '@components';
import { OrderSortingName } from '@enums';
import { DatePicker, FormControl, InputLabel, TextField } from '@fields';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import { DriverAccountsSelect } from '../driver-accounts-select';

import { AdminOrderStatisticsStatusSelect } from './admin-order-statistics-status-select';
import { AdminOrdersFiltersFormState, AdminOrdersFiltersProps } from './admin-orders-filters.types';
import { useAdminOrdersFilters } from './useAdminOrdersFilters';

import './admin-orders-filters.scss';

const cn = classname('admin-orders-filters');
const t = translateByNamespace('client:orders-page:filters');

export const AdminOrdersFilters = memo(({ initialFilters, onFiltersChange }: AdminOrdersFiltersProps) => {
    const { formRef, isCarriersOrdersPage, isCODOrdersPage, handleFiltersChange, handleFormSubmit } = useAdminOrdersFilters({
        initialFilters,
        onFiltersChange,
    });

    return (
        <Paper
            className={cn()}
            body={
                <>
                    <Form<AdminOrdersFiltersFormState>
                        onSubmit={handleFormSubmit}
                        subscription={{
                            values: true,
                        }}
                        initialValues={{}}
                        render={({ handleSubmit, form }) => {
                            formRef.current = form;

                            return (
                                <form className={cn('form', { short: isCODOrdersPage })} onSubmit={handleSubmit}>
                                    <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                                    <FormControl>
                                        <InputLabel>{t('search-subject-field-label')}</InputLabel>
                                        <Field name='searchSubject' component={SearchSubjectsSelect} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('search-field-label')}</InputLabel>
                                        <Field name='search' component={TextField} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('company-field-label')}</InputLabel>
                                        <Field name='companyPublicId' component={AsyncCompanySelect} />
                                    </FormControl>
                                    {isCODOrdersPage && (
                                        <FormControl>
                                            <InputLabel>{t('receipt-status-field-label')}</InputLabel>
                                            <Field name='instantTermPaymentType' component={ReceiptStatusSelect} isClearable={true} />
                                        </FormControl>
                                    )}
                                    {!isCODOrdersPage && (
                                        <>
                                            <FormControl>
                                                <InputLabel>{t('order-status-field-label')}</InputLabel>
                                                <Field
                                                    name='statisticsStatus'
                                                    component={AdminOrderStatisticsStatusSelect}
                                                    isClearable={true}
                                                    orderType={isCarriersOrdersPage ? 'carrier' : 'shipper'}
                                                />
                                            </FormControl>
                                            {isCarriersOrdersPage && (
                                                <FormControl>
                                                    <InputLabel>{t('payment-status-field-label')}</InputLabel>
                                                    <Field
                                                        name='fundsTransferCalculatedStatus'
                                                        component={FundsTransferCalculatedStatusSelect}
                                                        isClearable={true}
                                                    />
                                                </FormControl>
                                            )}
                                        </>
                                    )}
                                    <FormControl>
                                        <InputLabel>{t('drivers-field-label')}</InputLabel>
                                        <Field name='driverAccountId' component={DriverAccountsSelect} isClearable={true} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('dispatchers-field-label')}</InputLabel>
                                        <Field name='dispatchers' component={DispatchersSelect} isClearable={true} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('create-at-from-field-label')}</InputLabel>
                                        <Field name='createdAtFrom' component={DatePicker} isClearable={true} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{t('create-at-to-field-label')}</InputLabel>
                                        <Field name='createdAtTo' component={DatePicker} isClearable={true} />
                                    </FormControl>
                                    {!isCODOrdersPage && (
                                        <FormControl>
                                            <InputLabel>{t('sort-by-field-label')}</InputLabel>
                                            <Field name='sortBy' component={SortBySelect} options={OrderSortingName} />
                                        </FormControl>
                                    )}
                                </form>
                            );
                        }}
                    />
                </>
            }
        />
    );
});

AdminOrdersFilters.displayName = 'AdminOrdersFilters';
