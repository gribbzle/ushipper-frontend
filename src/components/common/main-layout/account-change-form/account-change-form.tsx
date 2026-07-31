import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';

import { useAppSelector } from '@store';
import { authorizedUserPublicIdSelector } from '@store/global';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { AccountChangeFormState } from './account-change-form.types';
import { AccountSelect } from './account-select';
import { useAccountChangeForm } from './use-account-change-form';

import './account-change-form.scss';

const t = translateByNamespace('common:sidebar');
const cn = classname('account-change-form');

export const AccountChangeForm = () => {
    const userPublicId = useAppSelector(authorizedUserPublicIdSelector);
    const handleFormSubmit = useCallback(() => undefined, []);

    return (
        <Form<AccountChangeFormState>
            onSubmit={handleFormSubmit}
            subscription={{
                values: true,
            }}
            initialValues={{ account: userPublicId }}
            render={({ handleSubmit }) => <FormComponent handleSubmit={handleSubmit} />}
        />
    );
};

const FormComponent = ({ handleSubmit }: { handleSubmit: () => void }) => {
    const { handleOnChange } = useAccountChangeForm();

    return (
        <form onSubmit={handleSubmit} className={cn()}>
            <FormValuesSpy onChange={handleOnChange} debounceTime={300} />
            <div className={cn('label')}>{t('company-block-label')}</div>
            <Field name='account' component={AccountSelect} />
        </form>
    );
};
