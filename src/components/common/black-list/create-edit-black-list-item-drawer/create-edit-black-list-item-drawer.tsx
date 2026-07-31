import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { FormControl, InputLabel, SwitchInput, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { nameWithSpacesValidator, required } from '@validators';

import { TermTypesSelect } from '../../terms-select/terms-select';

import { BlackListRoleTypesSelect } from './black-list-role-types-select';
import { CreateEditBlackListItemDrawerProps, CreateEditFormState } from './create-edit-black-list-item-drawer.types';
import { useCreateEditBlackListItemDrawer } from './use-create-edit-black-list-item-drawer';

import './create-edit-black-list-item-drawer.scss';

const t = translateByNamespace('common:black-list-page:create-edit-drawer');
const fieldsT = translateByNamespace('common:black-list-page:create-edit-drawer:fields');
const cn = classname('create-edit-black-list-item-drawer');

export const CreateEditBlackListItemDrawer = ({ isOpen, onClose }: CreateEditBlackListItemDrawerProps) => {
    const { headText, createEditUserModalMode, isNotVisible, formRef, initialValues, onSubmit, onSubmitHandler, onDeleteClickHandler } =
        useCreateEditBlackListItemDrawer({ isOpen });

    const actions = useMemo(() => {
        return (
            <>
                <Button view='primary' onClick={onSubmitHandler}>
                    {t('actions:save')}
                </Button>
                {createEditUserModalMode === 'edit' && (
                    <Button view='danger' onClick={onDeleteClickHandler}>
                        {t('actions:delete')}
                    </Button>
                )}
            </>
        );
    }, [createEditUserModalMode, onDeleteClickHandler, onSubmitHandler]);

    return (
        <Drawer
            className={cn()}
            isOpen={!isNotVisible}
            onClose={onClose}
            head={headText}
            actions={actions}
            body={
                <Form<CreateEditFormState>
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validateOnBlur={true}
                    subscription={{ values: true }}
                    render={({ handleSubmit, form, values: { isTermsVisible, isRoleTypesVisible } }) => {
                        formRef.current = form;

                        return (
                            <form onSubmit={handleSubmit} name='create-edit-user-form' autoComplete='off'>
                                <FormControl>
                                    <InputLabel required={true}>{fieldsT('name-label')}</InputLabel>
                                    <Field name='name' component={TextField} validate={required} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{fieldsT('mc-label')}</InputLabel>
                                    <Field name='usdot' component={TextField} validate={nameWithSpacesValidator()} />
                                </FormControl>
                                <Field name='isTermsVisible' component={SwitchInput} label={fieldsT('terms-switch-label')} />
                                {isTermsVisible && (
                                    <FormControl>
                                        <Field name='terms'>
                                            {({ input, meta }) => (
                                                <TermTypesSelect
                                                    input={input}
                                                    meta={meta}
                                                    className={cn('row')}
                                                    label={fieldsT('terms-label')}
                                                    isMulti={true}
                                                    showRequiredAsterisk={false}
                                                    closeMenuOnSelect={false}
                                                />
                                            )}
                                        </Field>
                                    </FormControl>
                                )}
                                <Field name='isRoleTypesVisible' component={SwitchInput} label={fieldsT('roles-switch-label')} />
                                {isRoleTypesVisible && (
                                    <FormControl>
                                        <Field name='roleTypes'>
                                            {({ input, meta }) => (
                                                <BlackListRoleTypesSelect
                                                    input={input}
                                                    meta={meta}
                                                    label={fieldsT('roles-label')}
                                                    isMulti={true}
                                                    closeMenuOnSelect={false}
                                                    placeholder=''
                                                />
                                            )}
                                        </Field>
                                    </FormControl>
                                )}
                                <FormControl>
                                    <InputLabel>{fieldsT('notes-label')}</InputLabel>
                                    <Field name='notes' component={TextField} multiline={true} />
                                </FormControl>
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
