import React from 'react';
import { Field, Form } from 'react-final-form';

import { DispatchersSelect, Paper } from '@components';
import { CloseIcon } from '@icons';
import { ShipperTrackingFiltersFormState } from '@store/client';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import { FavoriteDriversRadioGroup } from './favorite-drivers-radio-group';
import { ShipperTrackingFieldWrapper } from './shipper-tracking-field-wrapper';
import { StatusOrdersRadioGroup } from './status-orders-radio-group';
import { useShipperTrackingFiltersForm } from './use-shipper-tracking-filters';

import './shipper-tracking-filters.scss';

const t = translateByNamespace('client:tracking-page:shipper-filters');
const cn = classname('shipper-tracking-filters');

export const ShipperTrackingFilters = () => {
    const { onFilterChange, handleClose, initialValues, formRef } = useShipperTrackingFiltersForm();

    return (
        <Paper
            className={cn('')}
            body={
                <div className={cn('body')}>
                    <div className={cn('head')}>
                        {t('title')}
                        <div className={cn('close')} onClick={handleClose}>
                            <CloseIcon />
                        </div>
                    </div>
                    <Form<ShipperTrackingFiltersFormState>
                        onSubmit={onFilterChange}
                        initialValues={initialValues}
                        render={({ form, handleSubmit }) => {
                            formRef.current = form;

                            return (
                                <form onSubmit={handleSubmit} className={cn('form')}>
                                    <FormValuesSpy onChange={onFilterChange} debounceTime={300} />
                                    <StatusOrdersRadioGroup />
                                    <FavoriteDriversRadioGroup />
                                    <ShipperTrackingFieldWrapper title={t('manager-group-label')}>
                                        <Field
                                            name='dispatchers'
                                            component={DispatchersSelect}
                                            isClearable={true}
                                            placeholder={t('all')}
                                            isMulti={false}
                                            closeMenuOnSelect={true}
                                        />
                                    </ShipperTrackingFieldWrapper>
                                </form>
                            );
                        }}
                    />
                </div>
            }
        />
    );
};
