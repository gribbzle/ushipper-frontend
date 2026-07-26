import React, { MutableRefObject } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { AsyncDriverAccountsSelect } from '@components';
import { FormControl, InputLabel } from '@fields';
import { classname, parseField, translateByNamespace } from '@utils';
import { required } from '@validators';

import { useFuelCardToDriverForm } from './use-add-fuel-card-to-driver-form';

import './add-fuel-card-to-driver-form.scss';

export type AddFuelCardToDriverFormState = {
    accountId: string;
};

export type AddFuelCardToDriverFormProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<AddFuelCardToDriverFormState> | undefined>;
};

const t = translateByNamespace('admin:fuel:cards-page:add-fuel-card-to-driver-popup');
const cn = classname('add-fuel-card-to-driver-form');

export const AddFuelCardToDriverForm = ({ formRef, onAfterSubmit }: AddFuelCardToDriverFormProps) => {
    const { initialValues, onSubmit } = useFuelCardToDriverForm({ onAfterSubmit });

    return (
        <Form<AddFuelCardToDriverFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <InputLabel required={true}>{t('driver-label')}</InputLabel>
                            <Field
                                parse={parseField}
                                name='accountId'
                                placeholder=''
                                component={AsyncDriverAccountsSelect}
                                isClearable={false}
                                validate={required}
                            />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
