import React from 'react';
import { Field, Form } from 'react-final-form';

import { Button, Drawer } from '@/components/common';
import { FormControl, InputLabel, SelectField, StringInput } from '@fields';
import { classname, translateByNamespace } from '@utils';
import { composeValidators, emailValidator, required } from '@validators';

import { InviteUserFormData } from './invite-user-drawer.types';
import { useInviteUserDrawer } from './use-invite-user-drawer';

import './invite-user-drawer.scss';

const cn = classname('invite-user-drawer');
const t = translateByNamespace('client:staff-page');

export const InviteUserDrawer = () => {
    const { formRef, isOpened, rolesOptions, handleClose, handleInviteUserClick, handleSubmit, selectedRoleId, superiorUsersOptions, handleOnChangeRole } =
        useInviteUserDrawer();

    return (
        <Drawer
            onClose={handleClose}
            isOpen={isOpened}
            head={t('invite-user')}
            body={
                <Form<InviteUserFormData>
                    subscription={{ values: true }}
                    onSubmit={handleSubmit}
                    render={({ form }) => {
                        formRef.current = form;

                        return (
                            <form className={cn('')}>
                                <Field name='name' label={t('invite-drawer.name')} component={StringInput} />
                                <Field
                                    name='email'
                                    label={t('invite-drawer.email')}
                                    component={StringInput}
                                    required={true}
                                    validate={composeValidators(required, emailValidator)}
                                />
                                <FormControl>
                                    <InputLabel required={true}>{t('invite-drawer.role')}</InputLabel>
                                    <Field
                                        name='roleId'
                                        component={SelectField}
                                        options={rolesOptions}
                                        callback={handleOnChangeRole}
                                        validate={required}
                                        isClearable={false}
                                    />
                                </FormControl>
                                {selectedRoleId && superiorUsersOptions && (
                                    <FormControl>
                                        <InputLabel>{t('invite-drawer.parent')}</InputLabel>
                                        <Field name='parentUserId' component={SelectField} options={superiorUsersOptions} isClearable={true} />
                                    </FormControl>
                                )}
                            </form>
                        );
                    }}
                />
            }
            actions={
                <Button view='primary' onClick={handleInviteUserClick}>
                    {t('invite-user')}
                </Button>
            }
        />
    );
};
