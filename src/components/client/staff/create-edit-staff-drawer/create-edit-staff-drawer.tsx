import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { UserRoleType } from '@/enums';
import {FormControl} from '@/fields/form-control';
import {ImageFileInput} from '@/fields/image-file-input';
import {InputLabel} from '@/fields/input-label';
import {PasswordField} from '@/fields/password-field';
import {PhoneNumberInput} from '@/fields/phone-number-input';
import {SelectField} from '@/fields/select-field';
import {StringInput} from '@/fields/string-input';
import {SwitchInput} from '@/fields/switch-input';
import {TextField} from '@/fields/text-field';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import { composeValidators, emailValidator, passwordValidator, phoneValidator, required } from '@validators';

import { CreateEditFormState, CreateEditStaffDrawerProps } from './create-edit-staff-drawer.types';
import { useCreateEditStaffDrawer } from './use-create-edit-staff-drawer';

import './create-edit-staff-drawer.scss';

const t = translateByNamespace('common:create-edit-user-drawer');
const cn = classname('create-edit-staff-drawer');

export const CreateEditStaffDrawer = ({ isOpen, onClose, pageId }: CreateEditStaffDrawerProps) => {
    const {
        formRef,
        userRolesOptions,
        selectedRoleType,
        isUserCompanyPartner,
        headText,
        disableFields,
        isAdministratorsPage,
        isUsersPage,
        isNotVisible,
        initialValues,
        newPasswordError,
        createEditUserModalMode,
        disableUserRoleField,
        isMultiUserStaffEdit,
        onCloseHandler,
        onSubmitHandler,
        onDeleteClickHandler,
        setSelectedRole,
        onSubmit,
    } = useCreateEditStaffDrawer({ isOpen, pageId, onClose });

    const showTwilioPhoneField = useMemo(
        () =>
            isAdministratorsPage ||
            ((selectedRoleType === UserRoleType.CARRIER_DISPATCHER || selectedRoleType === UserRoleType.CARRIER_OWNER) && isUserCompanyPartner),
        [isAdministratorsPage, isUserCompanyPartner, selectedRoleType],
    );

    const actions = useMemo(() => {
        if (disableFields) {
            return null;
        }

        const addText = isAdministratorsPage ? t('add-admin-button') : t('add-user-button');
        const saveText = isAdministratorsPage ? t('save-admin-button') : t('save-user-button');
        const deleteText = isAdministratorsPage ? t('delete-admin-button') : t('delete-user-button');

        return (
            <>
                <Button view='primary' onClick={onSubmitHandler}>
                    {createEditUserModalMode === 'create' ? addText : saveText}
                </Button>
                {createEditUserModalMode === 'edit' && (
                    <Button view='danger' onClick={onDeleteClickHandler}>
                        {deleteText}
                    </Button>
                )}
            </>
        );
    }, [createEditUserModalMode, isAdministratorsPage, disableFields, onDeleteClickHandler, onSubmitHandler]);

    return (
        <Drawer
            className={cn()}
            isOpen={!isNotVisible}
            onClose={onCloseHandler}
            head={headText}
            actions={actions}
            body={
                <Form<CreateEditFormState>
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validateOnBlur={true}
                    subscription={{ values: true }}
                    render={({ handleSubmit, form, values: { email, name } }) => {
                        formRef.current = form;

                        return (
                            <form onSubmit={handleSubmit} name='create-edit-user-form' autoComplete='off'>
                                {isMultiUserStaffEdit && <AlertBlock>{t('alert-text', { name, projectName: getProjectName() })}</AlertBlock>}
                                {!isMultiUserStaffEdit && (
                                    <>
                                        <Field name='avatar' component={ImageFileInput} disabled={disableFields} />
                                        <FormControl>
                                            <InputLabel required={true}>{t('name-field-label')}</InputLabel>
                                            <Field
                                                name='name'
                                                component={TextField}
                                                validate={required}
                                                placeholder={t('no-placeholder')}
                                                disabled={disableFields}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel>{t('nickname-field-label')}</InputLabel>
                                            <Field name='nickname' component={TextField} placeholder={t('no-placeholder')} disabled={disableFields} />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel required={true}>{t('email-field-label')}</InputLabel>
                                            <Field
                                                autoComplete='off'
                                                type='email'
                                                name='email'
                                                component={TextField}
                                                validate={composeValidators(required, emailValidator)}
                                                placeholder={t('no-placeholder')}
                                                disabled={disableFields}
                                            />
                                        </FormControl>
                                    </>
                                )}
                                <FormControl>
                                    <InputLabel required={true}>{t('role-field-label')}</InputLabel>
                                    <Field
                                        name='role'
                                        component={SelectField}
                                        validate={required}
                                        options={userRolesOptions}
                                        isClearable={false}
                                        placeholder={t('no-placeholder')}
                                        disabled={disableFields || disableUserRoleField}
                                        callback={setSelectedRole}
                                    />
                                </FormControl>
                                {!isMultiUserStaffEdit && (
                                    <>
                                        <Field
                                            name='phone'
                                            component={PhoneNumberInput}
                                            label={t('phone-field-label')}
                                            validate={composeValidators(required, phoneValidator)}
                                            required={true}
                                            placeholder={t('no-placeholder')}
                                            disabled={disableFields}
                                        />
                                        {showTwilioPhoneField && (
                                            <Field
                                                name='twilioPhone'
                                                component={PhoneNumberInput}
                                                label={t('twilio-phone-field-label')}
                                                validate={phoneValidator}
                                                placeholder={t('no-placeholder')}
                                                disabled={disableFields}
                                            />
                                        )}
                                    </>
                                )}
                                {isUsersPage &&
                                    (selectedRoleType === UserRoleType.CARRIER_DISPATCHER || selectedRoleType === UserRoleType.DISPATCHER_OWNER) && (
                                        <FormControl>
                                            <InputLabel>{t('telegram-id-field-label')}</InputLabel>
                                            <Field name='telegramId' component={TextField} placeholder={t('no-placeholder')} disabled={disableFields} />
                                        </FormControl>
                                    )}
                                {!isMultiUserStaffEdit && (
                                    <>
                                        {selectedRoleType === UserRoleType.CARRIER_DRIVER && (
                                            <FormControl>
                                                <InputLabel>{t('trailer-capacity-field-label')}</InputLabel>
                                                <Field
                                                    name='trailerCapacity'
                                                    type='number'
                                                    component={StringInput}
                                                    placeholder={t('no-placeholder')}
                                                    disabled={disableFields}
                                                />
                                            </FormControl>
                                        )}
                                    </>
                                )}
                                {isUsersPage && (
                                    <FormControl>
                                        <InputLabel>{t('company-field-label')}</InputLabel>
                                        <Field
                                            name='companyName'
                                            component={StringInput}
                                            disabled={true}
                                            validate={required}
                                            placeholder={t('no-placeholder')}
                                        />
                                    </FormControl>
                                )}
                                {!isMultiUserStaffEdit && (
                                    <>
                                        <FormControl>
                                            <InputLabel required={createEditUserModalMode === 'create'}>{t('password-field-label')}</InputLabel>
                                            <PasswordField
                                                name='password'
                                                placeholder=''
                                                autoComplete='new-password'
                                                validate={composeValidators(createEditUserModalMode === 'create' ? required : null, passwordValidator(email))}
                                                disabled={disableFields}
                                                error={newPasswordError}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel required={createEditUserModalMode === 'create'}>{t('password-confirm-field-label')}</InputLabel>
                                            <PasswordField
                                                name='passwordConfirmation'
                                                placeholder=''
                                                autoComplete='new-password'
                                                validate={composeValidators(createEditUserModalMode === 'create' ? required : null, passwordValidator(email))}
                                                disabled={disableFields}
                                            />
                                        </FormControl>
                                    </>
                                )}
                                <Field name='isActive' component={SwitchInput} label={t('is-active-field-label')} disabled={disableFields} />
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
