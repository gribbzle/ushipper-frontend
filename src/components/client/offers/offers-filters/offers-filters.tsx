import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import CompanySelect from '@/components/common/company-select/company-select';
import { OfferSortingName } from '@/enums';
import { Paper, SearchSubjectsSelect, SortBySelect, Tabs } from '@components';
import { FormControl, InputLabel, StringInput } from '@fields';
import { useMeShipper } from '@hooks';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import { OffersFiltersProps, OffersFiltersTypes } from './offers-filters.types';
import { useOffersFiltersTabs } from './use-offer-filters-tabs';

import './offers-filters.scss';

const orderPageFilters = translateByNamespace('client:orders-page:filters');
const cn = classname('offers-filters');
const t = translateByNamespace('client:order-offers:filters');
const orderT = translateByNamespace('client:orders-page:filters');

export const OffersFilters = ({ offersStats, onSelectTab, onChangeFormValue }: OffersFiltersProps) => {
    const isShipperContext = useMeShipper();
    const { tabs } = useOffersFiltersTabs(offersStats);

    const companySelects = useMemo(() => {
        return (
            <>
                {isShipperContext ? (
                    <FormControl>
                        <InputLabel>{t('carrier')}</InputLabel>
                        <Field name='carrierCompanyId' component={CompanySelect} companyType='carrier' />
                    </FormControl>
                ) : (
                    <FormControl>
                        <InputLabel>{t('shipper')}</InputLabel>
                        <Field name='shipperCompanyId' component={CompanySelect} companyType='shipper' />
                    </FormControl>
                )}
            </>
        );
    }, [isShipperContext]);

    return (
        <Paper
            className={cn()}
            body={
                <div>
                    <Form<OffersFiltersTypes>
                        onSubmit={() => undefined}
                        subscription={{
                            values: true,
                        }}
                        render={() => (
                            <form className={cn('form')}>
                                <FormValuesSpy onChange={onChangeFormValue} debounceTime={300} />
                                <FormControl>
                                    <InputLabel>{orderPageFilters('search-subject-field-label')}</InputLabel>
                                    <Field name='searchSubject' component={SearchSubjectsSelect} offers={true} />
                                </FormControl>
                                <Field name='search' component={StringInput} label={orderPageFilters('search-field-label')} />
                                {companySelects}
                                <FormControl>
                                    <InputLabel>{orderT('sort-by-field-label')}</InputLabel>
                                    <Field name='sortBy' component={SortBySelect} options={OfferSortingName} />
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
