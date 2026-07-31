import React from 'react';
import { Field, Form } from 'react-final-form';

import LoadboardFiltersGroup from '@/components/client/loadboard/loadboard-filter-group/loadboard-filters-group';
import { LoadboardFilterLocation } from '@/components/client/loadboard/loadboard-filter-location/loadboard-filter-location';
import { Filters } from '@/components/client/loadboard/loadboard-filters/types';
import LoadboardFilterWaypoints from '@/components/client/loadboard/loadborad-filter-waypoints/loadboard-filter-waypoints';
import { Divider } from '@/components/common/divider/divider';
import { FieldCurrencyPrepend } from '@/components/common/field-currency-prepend/field-currency-prepend';
import { OrderSourceSelect } from '@/components/common/order-source-select/order-source-select';
import { SortBySelect } from '@/components/common/sort-by-select/sort-by-select';
import { TermTypesSelect } from '@/components/common/terms-select/terms-select';
import { TransportTypeSelect } from '@/components/common/transport-type-select/transport-type-select';
import { VehicleTypesSelect } from '@/components/common/vehicle-types-select/vehicle-types-select';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { OrderSortingName } from '@/enums';
import { AddressField } from '@/fields/address-field/address-field';
import RadiusField from '@/fields/radius-field/radius-field';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { FormControl, InputLabel, SelectField, SwitchInput, TextField } from '@fields';
import { useHasPartnerCompanies, useIsPartnerCompany, useMeDriver, useMeDriverRelated } from '@hooks';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { isUshipper } from '@utils/project-config';

import { LoadboardFiltersProps } from './loadboard-filters.types';
import { useLoadboardFilters } from './use-loadboard-filters';
import { useLoadboardFiltersOptions } from './use-loadboard-filters-options';

import './loadboard-filters.scss';

const cn = classname('loadboard-filters');

const t = translateByNamespace('client:loadboard-filters');

export const LoadboardFilters = ({ filters, filtersChanged }: LoadboardFiltersProps) => {
    const { conditionOptions, maxVehiclesAmountOptions, vehiclesAmountOptions, newPostedAfterOptions, readyToShipOptions } = useLoadboardFiltersOptions();

    const { onChangeRouteSearch, handleFiltersChange, showFilterBySource, initialFiltersRef, formRef, searchRoute } = useLoadboardFilters({
        filters,
        filtersChanged,
    });

    const isDriverRelated = useMeDriverRelated();
    const { hasPartnerCompanies } = useHasPartnerCompanies();
    const isPartner = useIsPartnerCompany();
    const isMeDriverOwner = useMeDriver();

    return (
        <Paper
            className={cn()}
            body={
                <Form<Filters>
                    onSubmit={async () => null}
                    initialValues={initialFiltersRef.current}
                    render={context => {
                        formRef.current = context.form;

                        return (
                            <form>
                                <FormValuesSpy<Filters> onChange={handleFiltersChange} debounceTime={500} />
                                <LoadboardFiltersGroup title={t('filter-by-location')}>
                                    {!searchRoute && (
                                        <>
                                            <Field name='origins'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <LoadboardFilterLocation meta={meta} input={input} label={t('origin')} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='destinations'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <LoadboardFilterLocation meta={meta} input={input} label={t('destination')} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </>
                                    )}
                                    {searchRoute && (
                                        <>
                                            <Field name='pathStartLocation'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('origin')} </InputLabel>
                                                        <AddressField input={input} meta={meta} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='pathWaypoints'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <LoadboardFilterWaypoints input={input} meta={meta} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='pathEndLocation'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('destination')} </InputLabel>
                                                        <AddressField input={input} meta={meta} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='distanceOffPath'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('distance-off-route')}</InputLabel>
                                                        <RadiusField input={input} meta={meta} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </>
                                    )}
                                    <FormControl className={cn('row')}>
                                        <NativeSwitch label={t('search-along-route')} checked={searchRoute} onChange={onChangeRouteSearch} />
                                    </FormControl>
                                </LoadboardFiltersGroup>
                                {isUshipper && (
                                    <>
                                        <Divider lineStyle='dashed' />
                                        <LoadboardFiltersGroup title={t('filter-by-vehicles')}>
                                            <Field name='vehicleTypes'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('vehicle-type')}</InputLabel>
                                                        <VehicleTypesSelect
                                                            input={input}
                                                            meta={meta}
                                                            isMulti={true}
                                                            placeholder={t('all')}
                                                            closeMenuOnSelect={false}
                                                        />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='trailerTypes'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('trailer-type')}</InputLabel>
                                                        <TransportTypeSelect
                                                            input={input}
                                                            meta={meta}
                                                            showRequiredAsterisk={false}
                                                            label={t('trailer-type')}
                                                            isMulti={true}
                                                            placeholder={t('all')}
                                                            closeMenuOnSelect={false}
                                                        />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='vehicleInop'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('condition')} </InputLabel>
                                                        <SelectField meta={meta} input={input} options={conditionOptions} placeholder={t('all')} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='vehiclesMinCount'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('col-1')}>
                                                        <InputLabel>{t('min-vehicles')} </InputLabel>
                                                        <SelectField meta={meta} input={input} options={vehiclesAmountOptions} isClearable={false} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='vehiclesMaxCount'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('col-2')}>
                                                        <InputLabel>{t('max-vehicles')} </InputLabel>
                                                        <SelectField meta={meta} input={input} options={maxVehiclesAmountOptions} placeholder={t('all')} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </LoadboardFiltersGroup>
                                    </>
                                )}
                                <Divider lineStyle='dashed' />
                                <LoadboardFiltersGroup title={t('filter-by-dates')}>
                                    <Field name='shippingReadyBefore'>
                                        {({ input, meta }) => (
                                            <FormControl className={cn('row')}>
                                                <InputLabel>{t('ready-to-ship')} </InputLabel>
                                                <SelectField meta={meta} input={input} options={readyToShipOptions} placeholder={t('all-time')} />
                                            </FormControl>
                                        )}
                                    </Field>
                                </LoadboardFiltersGroup>
                                <Divider lineStyle='dashed' />
                                <LoadboardFiltersGroup title={t('filter-by-payment')}>
                                    <Field name='paymentTerms'>
                                        {({ input, meta }) => (
                                            <TermTypesSelect
                                                input={input}
                                                meta={meta}
                                                className={cn('row')}
                                                label={t('payment-terms')}
                                                isMulti={true}
                                                showRequiredAsterisk={false}
                                                placeholder={t('all')}
                                                closeMenuOnSelect={false}
                                            />
                                        )}
                                    </Field>
                                    <Field name='minPricePerKm' type='number'>
                                        {({ input, meta }) => (
                                            <FormControl className={cn('col-1')}>
                                                <InputLabel>{t('min-price-mile')} </InputLabel>
                                                <TextField meta={meta} input={input} adornment={<FieldCurrencyPrepend />} placeholder='0' />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='minTotalPrice' type='number'>
                                        {({ input, meta }) => (
                                            <FormControl className={cn('col-2')}>
                                                <InputLabel>{t('min-total-price')} </InputLabel>
                                                <TextField meta={meta} input={input} adornment={<FieldCurrencyPrepend />} placeholder='0' />
                                            </FormControl>
                                        )}
                                    </Field>
                                </LoadboardFiltersGroup>
                                <Divider lineStyle='dashed' />
                                {showFilterBySource && (
                                    <>
                                        <LoadboardFiltersGroup title={t('filter-by-source')}>
                                            {!isDriverRelated && (
                                                <Field name='sources'>
                                                    {({ input, meta }) => (
                                                        <FormControl className={cn('row')}>
                                                            <InputLabel>{t('source-platform')} </InputLabel>
                                                            <OrderSourceSelect
                                                                input={input}
                                                                meta={meta}
                                                                className={cn('row')}
                                                                isMulti={true}
                                                                placeholder={t('all')}
                                                                closeMenuOnSelect={false}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </Field>
                                            )}
                                            <Field name='customerName'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('shipper')} </InputLabel>
                                                        <TextField meta={meta} input={input} placeholder={t('company-name-placeholder')} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='orderId'>
                                                {({ input, meta }) => (
                                                    <FormControl className={cn('row')}>
                                                        <InputLabel>{t('order-id')} </InputLabel>
                                                        <TextField meta={meta} input={input} placeholder={t('order-id-placeholder')} />
                                                    </FormControl>
                                                )}
                                            </Field>
                                            {((isMeDriverOwner && hasPartnerCompanies) || isPartner) && (
                                                <>
                                                    <Field name='includeCompanyBlacklist'>
                                                        {({ input, meta }) => (
                                                            <SwitchInput
                                                                input={input}
                                                                meta={meta}
                                                                label={t('include-company-blacklist')}
                                                                formControlClassName={cn('row')}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name='includeGlobalBlacklist'>
                                                        {({ input, meta }) => (
                                                            <SwitchInput
                                                                input={input}
                                                                meta={meta}
                                                                label={t('include-global-blacklist')}
                                                                formControlClassName={cn('row')}
                                                            />
                                                        )}
                                                    </Field>
                                                </>
                                            )}
                                        </LoadboardFiltersGroup>
                                        <Divider lineStyle='dashed' />
                                    </>
                                )}
                                <LoadboardFiltersGroup title={t('new-loads')}>
                                    <Field name='newPostedOnTopAfter'>
                                        {({ input, meta }) => (
                                            <FormControl className={cn('row')}>
                                                <InputLabel>{t('tag-loads')} </InputLabel>
                                                <SelectField meta={meta} input={input} options={newPostedAfterOptions} placeholder={t('hours', { count: 0 })} />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='newPostedOnTop'>
                                        {({ input, meta }) => (
                                            <SwitchInput input={input} meta={meta} label={t('tagged-on-top')} formControlClassName={cn('row')} />
                                        )}
                                    </Field>
                                </LoadboardFiltersGroup>
                                <Divider lineStyle='dashed' />
                                <LoadboardFiltersGroup title={t('sorting')}>
                                    <FormControl className={cn('row')}>
                                        <InputLabel>{t('sort-by')}</InputLabel>
                                        <Field name='primarySort' component={SortBySelect} options={OrderSortingName} closeMenuOnSelect={false} />
                                    </FormControl>
                                    <FormControl className={cn('row')}>
                                        <InputLabel>{t('then-by')}</InputLabel>
                                        <Field name='secondarySort' component={SortBySelect} options={OrderSortingName} closeMenuOnSelect={false} />
                                    </FormControl>
                                </LoadboardFiltersGroup>
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
