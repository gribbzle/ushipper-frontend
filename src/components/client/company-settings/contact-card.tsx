import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import parseValidationFields from '@/utils/parse-validation-fields';
import { Button, Paper } from '@components';
import { StringInput } from '@fields';
import { useGetCompanyData } from '@hooks';
import { useAppSelector } from '@store';
import { CompanyContactPathData, usePathCompanyContactMutation } from '@store/api/company-api';
import { authorizedUserSelector } from '@store/global';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';
import { composeValidators, emailValidator } from '@validators';

const loadboardT = translateByNamespace('client:loadboard-filters');
const cn = classname('company-settings-page');
const t = translateByNamespace('client:company-settings');
const tPlaceholder = translateByNamespace('client:company-settings:fields');

type FormType = CompanyContactPathData;
export default function ContactCard() {
    const user = useAppSelector(authorizedUserSelector);
    const { data } = useGetCompanyData();
    const formRef = useRef<FormApi<FormType>>();
    const submitRef = useRef<HTMLButtonElement>(null);
    const onSubmitHandler = useCallback(() => {
        if (submitRef.current) {
            submitRef.current.click();
        }
    }, []);

    const initialValues = useMemo<FormType>(() => {
        if (data) {
            return {
                names: data.contact?.names || '',
                emails: data.contact?.emails || '',
                phones: data.contact?.phones || '',
            };
        }

        return {};
    }, [data]);

    const [disabledSubmit, setDisabled] = useState(true);
    const [updateContact] = usePathCompanyContactMutation();
    const handleSubmit = useCallback(
        async (values: FormType) => {
            if (user?.companyPublicId) {
                try {
                    await updateContact({
                        companyId: user?.companyPublicId,
                        data: {
                            emails: values.emails || null,
                            names: values.names || null,
                            phones: values.phones || null,
                        },
                    }).unwrap();
                    setDisabled(true);
                    toast.success(t<string>('company-contact-update-success'));
                } catch (e) {
                    return parseValidationFields(e);
                }
            }
        },
        [user?.companyPublicId, updateContact],
    );

    const onChangeHandler = () => {
        if (formRef.current) {
            setDisabled(!Object.keys(formRef.current.getState().dirtyFields).length);
        }
    };

    return (
        <Paper
            title={t('contact-card-title')}
            body={
                <Form
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    subscription={{ values: true }}
                    render={({ handleSubmit, form }) => {
                        formRef.current = form;

                        return (
                            <form onSubmit={handleSubmit} className={cn('contact-form')}>
                                <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                                <Field name='names' label={t('fields:name')} component={StringInput} placeholder={tPlaceholder('no-placeholder')} />
                                <Field name='phones' label={t('fields:phone')} component={StringInput} placeholder={tPlaceholder('no-placeholder')} />
                                <Field
                                    name='emails'
                                    label={t('fields:email')}
                                    component={StringInput}
                                    validate={composeValidators(emailValidator)}
                                    placeholder={tPlaceholder('no-placeholder')}
                                />
                                <button ref={submitRef} type='submit' className={cn('invisible')} />
                            </form>
                        );
                    }}
                />
            }
            footer={
                <div>
                    <Button disabled={disabledSubmit} view='primary' onClick={onSubmitHandler}>
                        {loadboardT('save')}
                    </Button>
                </div>
            }
        />
    );
}
