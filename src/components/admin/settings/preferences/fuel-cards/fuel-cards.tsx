import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import {CurrencyInput} from '@/fields/currency-input';
import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {NativeSwitch, NativeSwitchProps} from '@/fields/switch-input';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, positiveNumberValidator, requiredCurrency } from '@validators';

import { PreferencesFormPaper } from '../preferences-form-paper';

const t = translateByNamespace('admin:preferences-page:fuel-cards');
const preferencesCn = classname('preferences-form-paper');

export const FuelCardsPreferences = () => (
    <PreferencesFormPaper context='fuel-cards' formName='fuel-cards-form'>
        <FieldPrefix prefix='fuelCards'>
            <FormControl>
                <PrefixedField
                    render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                        return <NativeSwitch checked={props.input.value} onChange={props.input.onChange} {...props} />;
                    }}
                    name='autoFuelCardTransactionsProcessing'
                    label={t('auto-fuel-card-transactions-processing-label')}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('default-rate-new-label')}</InputLabel>
                <PrefixedField
                    name='defaultRateNew'
                    parse={value => value}
                    placeholder=''
                    component={CurrencyInput}
                    startAdornment='%'
                    allowNegative={false}
                    decimalScale={0}
                    maxValue={100}
                    validate={requiredCurrency}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('default-rate-picked-up-label')}</InputLabel>
                <PrefixedField
                    name='defaultRatePickedUp'
                    parse={value => value}
                    placeholder=''
                    component={CurrencyInput}
                    startAdornment='%'
                    allowNegative={false}
                    decimalScale={0}
                    maxValue={100}
                    validate={requiredCurrency}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('default-rate-def-label')}</InputLabel>
                <PrefixedField
                    name='defaultRateDef'
                    parse={value => value}
                    placeholder=''
                    component={CurrencyInput}
                    startAdornment='%'
                    allowNegative={false}
                    decimalScale={0}
                    maxValue={100}
                    validate={requiredCurrency}
                />
            </FormControl>
            <div className={preferencesCn('row')}>
                <FormControl>
                    <InputLabel required={true}>{t('ulsd-conversion-rate-label')}</InputLabel>
                    <PrefixedField
                        name='ulsdConversionRate'
                        parse={value => value}
                        placeholder=''
                        component={CurrencyInput}
                        allowNegative={false}
                        allowLeadingZeros={false}
                        decimalScale={6}
                        validate={composeValidators(requiredCurrency, positiveNumberValidator())}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('def-conversion-rate-label')}</InputLabel>
                    <PrefixedField
                        name='defConversionRate'
                        parse={value => value}
                        placeholder=''
                        component={CurrencyInput}
                        allowNegative={false}
                        allowLeadingZeros={false}
                        decimalScale={6}
                        validate={composeValidators(requiredCurrency, positiveNumberValidator())}
                    />
                </FormControl>
            </div>
        </FieldPrefix>
    </PreferencesFormPaper>
);
