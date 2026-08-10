import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import CompanySelect from '@/components/common/company-select/company-select';
import { SearchSubjectsSelect } from '@/components/common/search-subjects-select/search-subjects-select';
import { SortBySelect } from '@/components/common/sort-by-select/sort-by-select';
import { Tabs } from '@/components/common/tabs/tabs';
import { Paper } from '@/components/common/paper/paper';
import { OfferSortingName } from '@/enums/offer-sorting-name';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {StringInput} from '@/fields/string-input';
import { useMeShipper } from '@/hooks/use-user-role-group';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

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
