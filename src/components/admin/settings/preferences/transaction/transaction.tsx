import React, { useCallback, useState } from 'react';
import { toKebabCase } from 'js-convert-case';

import { PerformTransactionEventsSelect } from '@/components/common/selects/preferences/perform-transaction-events-select/perform-transaction-events-select';
import { TransactionSystemSelect } from '@/components/common/selects/preferences/transaction-systems-select/transaction-systems-select';
import { DriverAccountsSelect } from '@/components/common/orders-page-layout/driver-accounts-select';
import { TransactionSystemEnum } from '@/enums';
import { FieldPrefix, FormControl, InputLabel, PrefixedField } from '@fields';
import { RegistrationSettings } from '@store/api/admin-configuration';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { PreferencesFormPaper } from '../preferences-form-paper';

const t = translateByNamespace('admin:preferences-page:transaction');
const getLabel = (name: string) => t(`${toKebabCase(name)}-label`);

const getFieldConfig = (name: string) => {
    switch (name) {
        case 'cashinAccountingSystem':
            return {
                label: getLabel(name),
                component: TransactionSystemSelect,
                disabled: true,
                isClearable: false,
            };
        case 'cashoutAccountingSystem':
            return {
                label: getLabel(name),
                component: TransactionSystemSelect,
                isClearable: false,
            };
        case 'performTransactionEvent':
            return {
                label: getLabel(name),
                component: PerformTransactionEventsSelect,
                isClearable: false,
            };
        case 'accountingSystemTestAccounts':
            return {
                label: getLabel(name),
                component: DriverAccountsSelect,
                isClearable: true,
                placeholder: t('all'),
            };
        default:
            return null;
    }
};

export const TransactionPreferences = () => {
    const [fieldNames, setFieldNames] = useState<string[]>([]);
    const [values, setValues] = useState<Partial<RegistrationSettings>>({});

    const handleFormChange = useCallback((values: Partial<RegistrationSettings>) => {
        if (values.transaction) {
            setFieldNames(Object.keys(values.transaction));
            setValues(values);
        }
    }, []);

    return (
        <PreferencesFormPaper context='transaction' formName='transaction-form' callback={handleFormChange}>
            {fieldNames.map(name => {
                const config = getFieldConfig(name);

                if (!config) {
                    console.error(`No config found for field: ${name}`);

                    return null;
                }

                if (
                    (name === 'accountingSystemTestAccounts' || name === 'performTransactionEvent') &&
                    values.transaction?.cashoutAccountingSystem === TransactionSystemEnum.MANUAL
                ) {
                    return null;
                }

                const { component, label, ...rest } = config;

                return (
                    <FieldPrefix key={name} prefix='transaction'>
                        <FormControl>
                            <InputLabel>{label}</InputLabel>
                            <PrefixedField name={name} component={component} validate={required} {...rest} />
                        </FormControl>
                    </FieldPrefix>
                );
            })}
        </PreferencesFormPaper>
    );
};
