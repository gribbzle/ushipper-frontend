import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';
import { useSelector } from 'react-redux';

import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { Drawer } from '@/components/common/drawer/drawer';
import parseValidationFields from '@/utils/parse-validation-fields';
import {PhoneNumberInput} from '@/fields/phone-number-input';
import {StringInput} from '@/fields/string-input';
import { useAppDispatch } from '@store';
import { createEditContactFormSubmit, createEditContactModalModeSelector, fetchedContactSelector } from '@store/client';
import { contactsActions } from '@store/common/contacts/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, emailValidator, phoneValidator } from '@validators';

import { AddressFields } from '../../company-settings';

import './create-edit-contacts-drawer.scss';
import CheckIcon from '@/assets/icons/check-icon.svg';
import TrashIcon from '@/assets/icons/trash-can.svg';

type Props = {
    pageId: 'administrators' | 'contacts';
    isOpen: boolean;
    onClose: () => void;
};

type CreateEditContactFormState = {
    name: string;
    city: string;
    state: string;
    zip: string;
    contactName: string;
    phone: string;
    email: string;
    address: string;
    internalNotes: string;
};

const t = translateByNamespace('common:create-edit-contact-drawer');
const cn = classname('create-edit-contacts-drawer');

export const CreateEditContactDrawer = (props: Props) => {
    const { isOpen, onClose, pageId } = props;
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<CreateEditContactFormState>>();

    const onSubmit = useCallback(
        async (values: CreateEditContactFormState) => {
            const res = await dispatch(createEditContactFormSubmit(values));

            return parseValidationFields(res.payload);
        },
        [dispatch],
    );

    const onSubmitHandler = useCallback(() => formRef.current?.submit(), []);

    const createEditContactModalMode = useSelector(createEditContactModalModeSelector);
    const fetchedContact = useSelector(fetchedContactSelector);

    const initialValues = useMemo(() => {
        if (!fetchedContact || createEditContactModalMode === 'create') {
            return {};
        }

        return fetchedContact;
    }, [createEditContactModalMode, fetchedContact]);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedContact) {
            dispatch(contactsActions.setDeleteContactPopupProps({ isVisible: true, contactId: fetchedContact.id, contactName: fetchedContact.name }));
        }
    }, [dispatch, fetchedContact]);

    const isNotVisible = !isOpen || (createEditContactModalMode === 'edit' && !fetchedContact);

    const isAdministratorsPage = pageId === 'administrators';

    const actions = useMemo(() => {
        if (isAdministratorsPage) {
            return null;
        }

        return (
            <>
                <Button view='primary' onClick={onSubmitHandler}>
                    <CheckIcon /> {t('save-contact-button')}
                </Button>
                {createEditContactModalMode === 'edit' && (
                    <Button view='danger' onClick={onDeleteClickHandler}>
                        <TrashIcon /> {t('delete-contact-button')}
                    </Button>
                )}
            </>
        );
    }, [createEditContactModalMode, onDeleteClickHandler, onSubmitHandler, isAdministratorsPage]);

    const headText = useMemo(() => {
        if (createEditContactModalMode !== 'create') {
            if (!isAdministratorsPage) {
                return t('edit-contact-head');
            }

            return t('admin-contact-head');
        }

        return t('add-contact-head');
    }, [createEditContactModalMode, isAdministratorsPage]);

    return (
        <Drawer
            className={cn()}
            isOpen={!isNotVisible}
            onClose={onClose}
            head={headText}
            actions={actions}
            body={
                <Form<CreateEditContactFormState>
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validateOnBlur={true}
                    subscription={{ values: true }}
                    render={({ handleSubmit, form }) => {
                        formRef.current = form;

                        return (
                            <form className={cn('form')} onSubmit={handleSubmit} name='create-edit-contacts-form'>
                                <Field
                                    className={cn('form-name-field')}
                                    name='name'
                                    label={t('name-field-label')}
                                    component={StringInput}
                                    required={true}
                                    placeholder={t('field-placeholder')}
                                />
                                <AddressFields />
                                <Divider>{t('my-orders-block-label')}</Divider>
                                <Field
                                    className={cn('form-contact-name-field')}
                                    name='contactName'
                                    label={t('contact-name-field-label')}
                                    component={StringInput}
                                    required={false}
                                    placeholder={t('field-placeholder')}
                                />
                                <Field
                                    className={cn('form-phone-field')}
                                    name='phone'
                                    component={PhoneNumberInput}
                                    label={t('phone-field-label')}
                                    placeholder={t('field-placeholder')}
                                    validate={composeValidators(phoneValidator)}
                                />
                                <Field
                                    className={cn('form-email-field')}
                                    name='email'
                                    label={t('email-field-label')}
                                    component={StringInput}
                                    validate={composeValidators(emailValidator)}
                                    placeholder={t('field-placeholder')}
                                />
                                <Field
                                    className={cn('form-notes-field')}
                                    name='internalNotes'
                                    label={t('notes-field-label')}
                                    component={StringInput}
                                    placeholder={t('field-placeholder')}
                                    textarea={true}
                                    resize='none'
                                />
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
