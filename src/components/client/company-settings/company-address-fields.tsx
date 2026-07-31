import React from 'react';
import { Field } from 'react-final-form';

import { StringInput } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

const cn = classname('create-edit-contacts-drawer');
const t = translateByNamespace('common:create-edit-contact-drawer');

export const AddressFields = () => {
    return (
        <>
            <Field
                className={cn('form-street-address-field')}
                name='address'
                component={StringInput}
                label={t('address-field-label')}
                placeholder={t('no-placeholder')}
                required={false}
            />
            <Field
                className={cn('form-city-field')}
                name='city'
                component={StringInput}
                label={t('city-field-label')}
                placeholder={t('no-placeholder')}
                required={false}
            />
            <Field
                className={cn('form-state-field')}
                name='state'
                component={StringInput}
                label={t('state-field-label')}
                placeholder={t('no-placeholder')}
                required={false}
            />
            <Field
                className={cn('form-zip-field')}
                name='zip'
                component={StringInput}
                label={t('zip-field-label')}
                placeholder={t('no-placeholder')}
                required={false}
            />
        </>
    );
};
