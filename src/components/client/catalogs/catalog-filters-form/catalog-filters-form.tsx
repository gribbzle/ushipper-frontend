import React from 'react';
import { Field, Form } from 'react-final-form';

import { CarriersCatalogSortingNameEnum, CatalogSortingNameEnum } from '@/enums';
import { CatalogFiltersGroup, CountriesSelect, Divider, LanguagesSelect, Paper, RatingCheckBoxGroup, SortBySelect } from '@components';
import { FormControl, InputLabel, TextField } from '@fields';
import { useIsCarriersCatalogPage, useIsDispatchersCatalogPage, useIsDriversCatalogPage } from '@hooks';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import { SpecializationsCheckBoxGroup } from './common';
import { useCatalogFiltersForm } from './use-catalog-filters-form';

import './catalog-filters-form.scss';

const t = translateByNamespace('client:catalogs.filters');
const cn = classname('catalog-filters-form');

export const CatalogFiltersForm = () => {
    const { handleFiltersChange, initialFiltersRef, formRef } = useCatalogFiltersForm();
    const { isCarriersCatalogPage } = useIsCarriersCatalogPage();
    const { isDispatchersCatalogPage } = useIsDispatchersCatalogPage();
    const { isDriversCatalogPage } = useIsDriversCatalogPage();

    return (
        <Paper
            className={cn()}
            body={
                <Form
                    onSubmit={async () => null}
                    initialValues={initialFiltersRef.current}
                    render={context => {
                        formRef.current = context.form;

                        return (
                            <form>
                                <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                                <CatalogFiltersGroup title={t('ratings')}>
                                    <RatingCheckBoxGroup />
                                </CatalogFiltersGroup>
                                <Divider lineStyle='dashed' />
                                <CatalogFiltersGroup title={t('specializations')}>
                                    <SpecializationsCheckBoxGroup />
                                </CatalogFiltersGroup>
                                <Divider lineStyle='dashed' />
                                <CatalogFiltersGroup title={t('country')}>
                                    <Field name='country' component={CountriesSelect} placeholder={t('location-placeholder')}></Field>
                                </CatalogFiltersGroup>
                                <Divider lineStyle='dashed' />
                                {(isDispatchersCatalogPage || isDriversCatalogPage) && (
                                    <CatalogFiltersGroup title={t('languages')}>
                                        <Field name='languages' component={LanguagesSelect} placeholder={t('languages-placeholder')} />
                                    </CatalogFiltersGroup>
                                )}
                                {isCarriersCatalogPage && (
                                    <CatalogFiltersGroup title={t('name')}>
                                        <Field name='name' component={TextField} placeholder={t('name-placeholder')} />
                                    </CatalogFiltersGroup>
                                )}
                                <Divider lineStyle='dashed' />
                                <CatalogFiltersGroup title={t('sorting')}>
                                    <FormControl>
                                        <InputLabel>{t('sort-by')}</InputLabel>
                                        <Field
                                            name='sortBy'
                                            component={SortBySelect}
                                            options={isCarriersCatalogPage ? CarriersCatalogSortingNameEnum : CatalogSortingNameEnum}
                                        />
                                    </FormControl>
                                </CatalogFiltersGroup>
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
