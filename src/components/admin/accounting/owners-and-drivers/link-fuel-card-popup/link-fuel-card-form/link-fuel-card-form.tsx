import React from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncFuelCardsSelect } from '@/components/common/selects/fuel/async-fuel-cards-select/async-fuel-cards-select';
import { FormControl, InputLabel } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { LinkFuelCardFormProps, LinkFuelCardFormState } from './link-fuel-card-form.types';
import { useLinkFuelCardForm } from './use-link-fuel-card-form';

import './link-fuel-card-form.scss';

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
