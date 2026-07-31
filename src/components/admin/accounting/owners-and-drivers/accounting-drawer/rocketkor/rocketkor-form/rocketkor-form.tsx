import React from 'react';
import { Field, FieldRenderProps, Form } from 'react-final-form';

import { Divider } from '@/components/common';
import { DatePicker, FieldPrefix, FormControl, InputLabel, NativeSwitch, NativeSwitchProps, PhoneNumberInput, TextField } from '@fields';
import { useFormSubmit } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, emailValidator, linkValidator, required, taxIdValidator, validateDateBeforeToday } from '@validators';

import { AddressForm, CountriesSelect } from '../../common';
import { RocketkorFormValue } from '../rocketkor.types';

import { TaxDocument } from './documents/tax-document';
import { BusinessTaxIdInput } from './business-tax-id-input';
import { CustomerTypeSelect } from './customer-type-select';
import { OwnershipDocument, PassportDocument } from './documents';
import { RocketkorFormProps } from './rocketkor-form.types';
import { TypeOfBusinessSelect } from './type-of-business-select';
import { useRocketkorForm } from './use-rocketkor-form';
import { requiredIfAnyMailingAddressFieldFilled } from './utils';

import './rocketkor-form.scss';

const cn = classname('rocketkor-form');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const RocketkorForm = ({ handleCloseForm }: RocketkorFormProps) => {
    const { initialValues, rocketkorFormId, handleSubmit } = useRocketkorForm(handleCloseForm);

    const { formSubmit } = useFormSubmit<RocketkorFormValue>();

    return (
        <Form<RocketkorFormValue>
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={requiredIfAnyMailingAddressFieldFilled}
            render={({ form, values: { areAddressesSame } }) => (
                <form className={cn()} onSubmit={e => formSubmit(form, e)} id={rocketkorFormId}>
                    <FormControl>
                        <InputLabel required={true}>{t('customer-type')}</InputLabel>
                        <Field name='type' component={CustomerTypeSelect} validate={required} disabled={true} />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{t('business-name')}</InputLabel>
                        <Field name='businessName' component={TextField} validate={required} />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{t('legal-name-of-business')}</InputLabel>
                        <Field name='legalName' component={TextField} validate={required} />
                    </FormControl>
                    <div className={cn('row')}>
                        <FormControl>
                            <InputLabel required={true}>{t('first-name')}</InputLabel>
                            <Field name='firstName' component={TextField} validate={required} />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('last-name')}</InputLabel>
                            <Field name='lastName' component={TextField} validate={required} />
                        </FormControl>
                    </div>
                    <div className={cn('row')}>
                        <FormControl>
                            <InputLabel required={true}>{t('email')}</InputLabel>
                            <Field name='email' component={TextField} disabled={true} validate={composeValidators(required, emailValidator)} />
                        </FormControl>
                        <FormControl>
                            <Field
                                name='phone'
                                component={PhoneNumberInput}
                                disabled={true}
                                label={t('primary-phone-number')}
                                required={true}
                                validate={required}
                            />
                        </FormControl>
                    </div>
                    <div className={cn('row')}>
                        <FormControl>
                            <InputLabel required={true}>{t('business-tax-id')}</InputLabel>
                            <Field
                                name='taxId'
                                component={BusinessTaxIdInput}
                                validate={composeValidators(required, taxIdValidator())}
                                placeholder='XX-XXXXXXX'
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('business-tax-id-country')}</InputLabel>
                            <Field name='taxIdCountry' disabled={true} component={CountriesSelect} validate={required} />
                        </FormControl>
                    </div>
                    <div className={cn('row')}>
                        <FormControl>
                            <InputLabel required={true}>{t('type-of-business')}</InputLabel>
                            <Field name='legalEntityType' component={TypeOfBusinessSelect} validate={required} isClearable={false} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('date-of-formation')}</InputLabel>
                            <Field name='dateOfFormation' component={DatePicker} placeholder='MM/DD/YY' validate={validateDateBeforeToday()} />
                        </FormControl>
                    </div>
                    <FormControl>
                        <InputLabel>{t('company-website')}</InputLabel>
                        <Field name='website' component={TextField} validate={linkValidator} />
                    </FormControl>
                    <Divider>{t('physical-address-must')}</Divider>
                    <FieldPrefix prefix='physicalAddress'>
                        <AddressForm required={true} />
                    </FieldPrefix>
                    <FormControl>
                        <Field
                            render={(props: FieldRenderProps<boolean> & NativeSwitchProps) => {
                                return <NativeSwitch checked={props.input.value} onChange={props.input.onChange} {...props} />;
                            }}
                            name='areAddressesSame'
                            label={t('same-address')}
                        />
                    </FormControl>
                    {!areAddressesSame && (
                        <>
                            <Divider>{t('mailing-address-must')}</Divider>
                            <FieldPrefix prefix='mailingAddress'>
                                <AddressForm />
                            </FieldPrefix>
                        </>
                    )}
                    <Divider>{t('identity-documents')}</Divider>
                    <TaxDocument />
                    <OwnershipDocument />
                    <PassportDocument />
                </form>
            )}
        />
    );
};
