import React from 'react';
import { useForm } from 'react-final-form';

import { Divider } from '@/components/common/divider/divider';
import { ContractorTypesEnum } from '@/enums/contractor-types-enum';
import {FieldPrefix, PrefixedField, PrefixedFieldArray} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {SwitchInput} from '@/fields/switch-input';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required, requiredArray } from '@validators';

import { AgreementsDetailsFormState } from '../agreements-details.types';
import { SettingsBlockWrapper } from '../settings-block-wrapper';

import { BalanceLimitField } from './balance-limit-field';
import { LoadboardPaymentTermsSelect } from './loadboard-payment-terms-select';
import { LoadboardSourcesSelect } from './loadboard-sourses-select';

const settingsCn = classname('settings-block-wrapper');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');

export const DriverAccountSettingsBlock = ({ fieldsPrefix, disabled }: { fieldsPrefix: string; disabled: boolean }) => {
    const { getState } = useForm<AgreementsDetailsFormState>();

    const {
        contractorType,
        driverSettings: { hasDriverLimitBalance },
    } = getState().values;

    return (
        <SettingsBlockWrapper>
            <Divider>{t('driver-settings-divider')}</Divider>
            <FieldPrefix prefix={fieldsPrefix}>
                {contractorType === ContractorTypesEnum.DRIVER_OWNER && (
                    <>
                        <PrefixedField
                            disabled={disabled}
                            name='hasDriverLimitBalance'
                            component={SwitchInput}
                            label={t('balance-limit-label')}
                            formControlClassName={settingsCn('switch')}
                        />
                        {hasDriverLimitBalance && <BalanceLimitField disabled={disabled} />}
                    </>
                )}
                <div className={settingsCn('row')}>
                    <FormControl>
                        <InputLabel required={true}>{t('loadboard-payment-terms-label')}</InputLabel>
                        <PrefixedField
                            name='loadboardPaymentTerms'
                            parse={value => value}
                            component={LoadboardPaymentTermsSelect}
                            validate={required}
                            menuPlacement='auto'
                            placeholder=''
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{t('loadboard-sources-label')}</InputLabel>
                        <PrefixedFieldArray
                            name='loadboardSources'
                            parse={value => value}
                            component={LoadboardSourcesSelect}
                            isMulti={true}
                            isClearable={true}
                            validate={requiredArray}
                            closeMenuOnSelect={false}
                            menuPlacement='auto'
                            placeholder=''
                            disabled={disabled}
                        />
                    </FormControl>
                </div>
                <PrefixedField
                    disabled={disabled}
                    name='ordersShowFullPrice'
                    component={SwitchInput}
                    label={t('orders-show-full-price-label')}
                    formControlClassName={settingsCn('switch')}
                />
                <PrefixedField
                    disabled={disabled}
                    name='orderRequestsAllowed'
                    component={SwitchInput}
                    label={t('order-requests-allowed-label')}
                    formControlClassName={settingsCn('switch')}
                />
            </FieldPrefix>
        </SettingsBlockWrapper>
    );
};
