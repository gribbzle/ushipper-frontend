import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { FormApi } from 'final-form';
import { Form, FormSpy } from 'react-final-form';
import { toast } from 'react-toastify';

import { Button, Paper } from '@components';
import { RegistrationSettings, useGetAdminConfigQuery, usePostAdminConfigMutation } from '@store/api/admin-configuration';
import { classname, translateByNamespace } from '@utils';

import './preferences-form-paper.scss';

const t = translateByNamespace('admin:preferences-page');
const cn = classname('preferences-form-paper');

type PreferencesFormPaperProps = {
    children: ReactNode;
    formName: string;
    context: 'registration' | 'fuel-cards' | 'transaction';
    callback?: (values: Partial<RegistrationSettings>) => void;
};

export const PreferencesFormPaper = ({ formName, context, children, callback }: PreferencesFormPaperProps) => {
    const { data: config } = useGetAdminConfigQuery();
    const [postAdminConfig] = usePostAdminConfigMutation();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const formRef = useRef<FormApi<RegistrationSettings>>();

    const handleSubmit = useCallback(() => formRef.current?.submit(), []);

    const actions = useMemo(
        () => (
            <Button disabled={isSubmitDisabled} view='primary' onClick={handleSubmit}>
                {t('save-label')}
            </Button>
        ),
        [isSubmitDisabled, handleSubmit],
    );

    const onSubmit = useCallback(
        (values: RegistrationSettings) => {
            setIsSubmitDisabled(true);

            postAdminConfig(values)
                .unwrap()
                .then(() => {
                    toast.success<string>(t(`notifications.update-${context}-success-notification`));
                    formRef.current?.initialize(values);
                })
                .catch(error => toast.error(error.data.message));
        },
        [context, postAdminConfig],
    );

    const handleChange = useCallback(() => {
        const isDirty = formRef.current?.getState().dirty;
        const values = formRef.current?.getState().values;

        setIsSubmitDisabled(isDirty === undefined ? true : !isDirty);

        if (values) {
            callback?.(values);
        }
    }, [callback]);

    return (
        <Paper
            className={cn()}
            title={t(`${context}.title`)}
            body={
                <Form<RegistrationSettings>
                    initialValues={config}
                    onSubmit={onSubmit}
                    validateOnBlur={true}
                    subscription={{ values: true }}
                    render={({ form, handleSubmit }) => {
                        formRef.current = form;

                        return (
                            <form onSubmit={handleSubmit} name={formName}>
                                <FormSpy subscription={{ dirty: true, initialValues: true }} onChange={handleChange} />
                                {children}
                            </form>
                        );
                    }}
                />
            }
            footer={actions}
        />
    );
};
