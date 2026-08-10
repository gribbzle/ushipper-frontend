import React from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncDriverAccountsSelect } from '@/components/common/selects/async-driver-accounts-select/async-driver-accounts-select';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';
import { required } from '@validators';

import { AddFuelCardToDriverFormProps, AddFuelCardToDriverFormState } from './add-fuel-card-to-driver-form.types';
import { useFuelCardToDriverForm } from './use-add-fuel-card-to-driver-form';

import './add-fuel-card-to-driver-form.scss';

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
