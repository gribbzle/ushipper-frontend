import React from 'react';
import { Field, Form } from 'react-final-form';

import { FormControl, InputLabel, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { CreateWalletFormProps, CreateWalletFormState } from './create-wallet-form.types';
import { useCreateWalletForm } from './use-create-wallet-form';

import './create-wallet-form.scss';

const t = translateByNamespace('admin:accounting:wallets-page:create-wallet-popup');
const cn = classname('create-wallet-form');

export const CreateWalletForm = ({ formRef, onAfterSubmit }: CreateWalletFormProps) => {
    const { initialValues, onSubmit } = useCreateWalletForm({ onAfterSubmit });

    return (
        <Form<CreateWalletFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <InputLabel required={true}>{t('wallet-name-label')}</InputLabel>
                            <Field name='name' component={TextField} validate={required} parse={value => value} />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
