import React, { MutableRefObject } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { AsyncFuelCardsSelect } from '@components';
import { FormControl, InputLabel } from '@fields';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import { useLinkFuelCardForm } from './use-link-fuel-card-form';

import './link-fuel-card-form.scss';

export type LinkFuelCardFormState = {
    fuelCardId: number;
};

export type LinkFuelCardFormProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<LinkFuelCardFormState> | undefined>;
};

const t = translateByNamespace('admin:accounting:owners-and-drivers:link-fuel-card-popup');
const cn = classname('link-fuel-card-form');

export const LinkFuelCardForm = ({ formRef, onAfterSubmit }: LinkFuelCardFormProps) => {
    const { onSubmit } = useLinkFuelCardForm({ onAfterSubmit });

    return (
        <Form<LinkFuelCardFormState>
            subscription={{ values: true }}
            initialValues={{}}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <InputLabel required={true}>{t('fuel-card-label')}</InputLabel>
                            <Field<number>
                                parse={value => value}
                                name='fuelCardId'
                                placeholder=''
                                component={AsyncFuelCardsSelect}
                                isClearable={false}
                                validate={required}
                                filterUnlinkedOnly={true}
                            />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
