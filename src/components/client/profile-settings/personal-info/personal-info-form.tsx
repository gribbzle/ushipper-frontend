import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { CountriesSelect } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/common/countries-select/countries-select';
import { AddressFields } from '@/components/client/company-settings/company-address-fields';
import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { FormControl, ImageFileInput, InputLabel, PhoneNumberInput, TextField } from '@fields';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';
import { composeValidators, emailValidator, phoneValidator, required } from '@validators';

import { usePersonalInfoForm } from './use-personal-info-form';

import './personal-info-form.scss';

const FORM_ID = 'personalInfoFormId';

const t = translateByNamespace('client:profile-settings.personal-info');
const tFields = translateByNamespace('client:profile-settings.personal-info.fields');

const cn = classname('personal-info');

export const PersonalInfoForm = () => {
    const { initialValues, formRef, onChangeHandler, handleSubmit, disabledSubmit } = usePersonalInfoForm();

    const body = useMemo(
        () => (
            <>
                <Form
                    subscription={{ values: true }}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit, form }) => {
                        formRef.current = form;

                        return (
                            <form className={cn('form')} onSubmit={handleSubmit} id={FORM_ID}>
                                <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                                <Field name='avatar' component={ImageFileInput} fileEntity={t('logo')} />
                                <FormControl>
                                    <InputLabel required={true}>{tFields('name')}</InputLabel>
                                    <Field name='name' component={TextField} validate={required} parse={parseField} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{tFields('description')}</InputLabel>
                                    <Field name='description' component={TextField} multiline={true} parse={parseField} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{tFields('email')}</InputLabel>
                                    <Field
                                        name='email'
                                        component={TextField}
                                        validate={composeValidators(required, emailValidator)}
                                        autocomplete='off'
                                        placeholder={tFields('email-placeholder')}
                                        parse={parseField}
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{tFields('phone')}</InputLabel>
                                    <Field
                                        name='phone'
                                        placeholder='+1'
                                        component={PhoneNumberInput}
                                        validate={composeValidators(required, phoneValidator)}
                                        parse={parseField}
                                    />
                                </FormControl>
                                <Divider>{tFields('divider-location-details')}</Divider>
                                <div className={cn('location-details')}>
                                    <AddressFields />
                                    <FormControl className={cn('country')}>
                                        <InputLabel>{tFields('country')}</InputLabel>
                                        <Field name='country' component={CountriesSelect} />
                                    </FormControl>
                                </div>
                            </form>
                        );
                    }}
                />
            </>
        ),
        [handleSubmit, initialValues, formRef, onChangeHandler],
    );

    const footer = useMemo(
        () => (
            <div>
                <Button disabled={disabledSubmit} view='primary' type='submit' form={FORM_ID}>
                    {t('save-btn-label')}
                </Button>
            </div>
        ),
        [disabledSubmit],
    );

    return <Paper title={t('title')} bodyClassName={cn('body')} body={body} footer={footer} />;
};
