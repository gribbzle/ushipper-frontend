import React, { useMemo } from 'react';
import { useForm } from 'react-final-form';

import { FuelCardsRule } from '@/enums/fuel/fuel-cards-rules-enum';
import {CurrencyInput} from '@/fields/currency-input';
import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { useGetAdminConfigQuery } from '@store/api/admin-configuration';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { requiredCurrency } from '@validators';

import { AgreementsDetailsFormState } from '../agreements-details.types';
import { SettingsBlockWrapper } from '../settings-block-wrapper';

import { FuelCardsRulesSelectionButtonGroup } from './fuel-cards-rules-selection-button-group';
import { GlobalFuelCardsSettingsBlock } from './global-fuel-cards-settings-block';

import './fuel-cards-settings-block.scss';

const cn = classname('fuel-cards-settings-block');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements:fuel-cards-settings');

export const FuelCardsSettingsBlock = ({ fieldsPrefix, disabled }: { fieldsPrefix: string; disabled: boolean }) => {
    const { getState } = useForm<AgreementsDetailsFormState>();

    const {
        fuelCardsSettings: { fuelCardsRules },
    } = getState().values;

    const { data: config, isLoading } = useGetAdminConfigQuery();

    const fuelRates = useMemo(() => {
        const { defaultRateDef, defaultRateNew, defaultRatePickedUp } = config?.fuelCards || {};

        return [
            { label: t('fuel-limit-rate-label', { type: t('new-orders') }), rate: defaultRateNew },
            { label: t('fuel-limit-rate-label', { type: t('picked-up-orders') }), rate: defaultRatePickedUp },
            { label: t('def-limit-label'), rate: defaultRateDef },
        ];
    }, [config]);

    return (
        <SettingsBlockWrapper>
            <FieldPrefix prefix={fieldsPrefix}>
                <FormControl>
                    <InputLabel>{t('fuel-limit-rules-label')}</InputLabel>
                    <FuelCardsRulesSelectionButtonGroup name={`${fieldsPrefix}.fuelCardsRules`} disabled={disabled} />
                </FormControl>
                {fuelCardsRules === FuelCardsRule.CUSTOM_RULES ? (
                    <div className={cn('row')}>
                        <FormControl>
                            <InputLabel required={true}>{t('fuel-limit-rate-label', { type: t('new-orders') })}</InputLabel>
                            <PrefixedField
                                name='fuelLimitRateNew'
                                parse={value => value}
                                placeholder=''
                                component={CurrencyInput}
                                startAdornment='%'
                                allowNegative={false}
                                decimalScale={0}
                                maxValue={100}
                                disabled={disabled}
                                validate={requiredCurrency}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('fuel-limit-rate-label', { type: t('picked-up-orders') })}</InputLabel>
                            <PrefixedField
                                name='fuelLimitRatePickedUp'
                                parse={value => value}
                                placeholder=''
                                component={CurrencyInput}
                                startAdornment='%'
                                allowNegative={false}
                                decimalScale={0}
                                maxValue={100}
                                disabled={disabled}
                                validate={requiredCurrency}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('def-limit-label')}</InputLabel>
                            <PrefixedField
                                name='fuelLimitRateDef'
                                parse={value => value}
                                placeholder=''
                                component={CurrencyInput}
                                startAdornment='%'
                                allowNegative={false}
                                decimalScale={0}
                                maxValue={100}
                                disabled={disabled}
                                validate={requiredCurrency}
                            />
                        </FormControl>
                    </div>
                ) : (
                    <GlobalFuelCardsSettingsBlock fuelRates={fuelRates} isLoading={isLoading} />
                )}
            </FieldPrefix>
        </SettingsBlockWrapper>
    );
};
