import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { Button, LanguagesSelect, Paper, TransportServiceSelect, WorkingTimeSelectionButtonGroup } from '@components';
import { FormControl, InputLabel, StringInput, TextField } from '@fields';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';
import { required } from '@validators';

import { BusinessInfoFormState } from './business-info-form.types';
import { SpecializationCategoriesFields } from './specializations-categories-fields';
import { useBusinessInfoForm } from './use-business-info-form';

import './business-info-form.scss';

const FORM_ID = 'businessInfoFormId';

const t = translateByNamespace('client:profile-settings.business-info');
const tFields = translateByNamespace('client:profile-settings.business-info.fields');
const cn = classname('business-info');

export const BusinessInfo = () => {
    const { initialValues, formRef, onChangeHandler, handleSubmit, disabledSubmit } = useBusinessInfoForm();

    const body = useMemo(
        () => (
            <>
                <Form<BusinessInfoFormState>
                    subscription={{ values: true }}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit, form }) => {
                        formRef.current = form;

                        return (
                            <form className={cn('form')} onSubmit={handleSubmit} id={FORM_ID}>
                                <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                                <FormControl>
                                    <InputLabel>{tFields('specialization')} </InputLabel>
                                    <Field<number[]> name='specializations' component={TransportServiceSelect} />
                                </FormControl>
                                <SpecializationCategoriesFields />
                                <FormControl>
                                    <InputLabel required={true}>{tFields('working-time')}</InputLabel>
                                    <WorkingTimeSelectionButtonGroup name='businessHours' validate={required} />
                                </FormControl>
                                <div className={cn('fields-wrapper')}>
                                    <FormControl>
                                        <InputLabel required={true}>{tFields('dispatch-fee')}</InputLabel>
                                        <Field name='dispatchFee' component={TextField} startAdornment='%' validate={required} />
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel>{tFields('birth-year')}</InputLabel>
                                        <Field name='inBusinessSince' component={StringInput} type='number' />
                                    </FormControl>
                                </div>
                                <FormControl>
                                    <InputLabel>{tFields('spoken-languages')}</InputLabel>
                                    <Field name='communicationLanguages' component={LanguagesSelect} />
                                </FormControl>
                            </form>
                        );
                    }}
                />
            </>
        ),
        [formRef, handleSubmit, initialValues, onChangeHandler],
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
