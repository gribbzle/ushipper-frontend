import React from 'react';
import { Field, Form } from 'react-final-form';

import { Divider } from '@/components/common/divider/divider';
import { BalanceType } from '@/enums';
import {FieldPrefix} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useFormSubmit } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { AddressForm } from '../../common';

import { AccountCategorySelect } from './account-category-select';
import { AccountTypeSelectionButtonGroup } from './account-type-selection-button-group';
import { AccountTypesSelect } from './account-types-select';
import { BankAccount } from './bank-account';
import { BillingInfoAlert } from './billing-info-alert';
import { CardAccount } from './card-account';
import { FinancialAccountFormValue } from './financial-account-form.types';
import { useFinancialAccountForm } from './use-financial-account-form';
import { requiredIfAnyAddressFieldFilled } from './utils';

import './financial-account-form.scss';

const cn = classname('financial-account-form');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const FinancialAccountForm = () => {
    const { initialValues, financialAccountFormId, isEdit, handleSubmit } = useFinancialAccountForm();
    const { formSubmit } = useFormSubmit<FinancialAccountFormValue>();

    return (
        <Form<FinancialAccountFormValue>
            initialValues={initialValues}
            subscription={{ values: true }}
            validate={requiredIfAnyAddressFieldFilled}
            onSubmit={handleSubmit}
            render={({ form, values: { type } }) => (
                <form className={cn()} onSubmit={e => formSubmit(form, e)} id={financialAccountFormId}>
                    <div className={cn('', { row: isEdit })}>
                        <FormControl>
                            <InputLabel required={true}>{t('account-category')}</InputLabel>
                            <Field name='accountCategory' component={AccountCategorySelect} validate={required} disabled={true} />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('account-type')}</InputLabel>
                            {isEdit ? (
                                <Field name='type' component={AccountTypesSelect} disabled={isEdit} validate={required} placeholder='' />
                            ) : (
                                <AccountTypeSelectionButtonGroup name='type' />
                            )}
                        </FormControl>
                    </div>

                    <FormControl>
                        <InputLabel required={true}>{t('financial-account-name')}</InputLabel>
                        <Field name='name' component={TextField} validate={required} placeholder='' />
                    </FormControl>
                    {type === BalanceType.EXTERNAL_BANK_WALLET ? (
                        <>
                            <Divider>{t('banking-info-divider')}</Divider>
                            <BankAccount />
                        </>
                    ) : (
                        <>
                            <Divider>{t('card-info-divider')}</Divider>
                            <CardAccount />
                        </>
                    )}

                    <Divider>{t('billing-info-divider')}</Divider>
                    <BillingInfoAlert />
                    <FieldPrefix prefix='billingAddress'>
                        <AddressForm isBillingAddress={true} />
                    </FieldPrefix>
                </form>
            )}
        />
    );
};
