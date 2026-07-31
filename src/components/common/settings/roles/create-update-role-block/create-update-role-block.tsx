import React from 'react';
import { toCamelCase } from 'js-convert-case';
import { Field, Form } from 'react-final-form';

import { Accordion } from '@/components/common/accordion/accordion';
import { Button } from '@/components/common/button/button';
import { Divider } from '@/components/common/divider/divider';
import { Loader } from '@/components/common/loader/loader';
import { RolesSelect } from '@/components/common/selects/roles-select/roles-select';
import { UserRoleType } from '@/enums';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { FormControl, InputLabel, SelectField, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { CreateUpdateRoleFormState } from './create-update-role-block.types';
import { AdminPermissionGroupsMap, AdminPermissionsMap, ClientPermissionGroupsMap, ClientPermissionMap } from './permissions-maps';
import { SelectAllPermissionsSwitch } from './select-all-permissions-switch';
import { excludedPermissions, useCreateUpdateRoleBlock } from './use-create-update-role-block';
import { filterPermissions } from './utils';

import './create-update-role-block.scss';

const t = translateByNamespace('common:create-update-role-block');
const cn = classname('create-update-role-block');

export const CreateUpdateRoleBlock = () => {
    const {
        fetchedRole,
        roleTypes,
        mode,
        showLoader,
        initialValues,
        userRolesOptions,
        isSelectedAllPermissions,
        selectedRoleType,
        allowSubordinateUsers,
        permissionState,
        setPermissionState,
        setSelectedRoleType,
        setIsSelectedAllPermissions,
        handleSelectAllChange,
        handleChangeSubordinateUsers,
        onDeleteClickHandler,
        onChangePermission,
        onSubmit,
    } = useCreateUpdateRoleBlock();

    if (showLoader) {
        return (
            <div className={cn('', [cn('loader')])}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={cn()}>
            <div className={cn('head')}>{mode === 'create' ? t('add-role-header-title') : t('role-settings-title', { roleName: fetchedRole?.name || '' })}</div>
            <div className={cn('body')}>
                <Form<CreateUpdateRoleFormState>
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    render={({ handleSubmit, values: { roleType } }) => {
                        const rolePermissions = roleTypes?.[toCamelCase(roleType || '')];
                        const filteredRolePermissions = filterPermissions(rolePermissions ?? {}, excludedPermissions);

                        const isDisabled = roleType ? [UserRoleType.CARRIER_OWNER, UserRoleType.SHIPPER_OWNER].includes(roleType) : false;

                        return (
                            <form onSubmit={handleSubmit} name='create-edit-user-form'>
                                <FormControl>
                                    <InputLabel required={true}>{t('form.name-field-label')}</InputLabel>
                                    <Field subscription={{ value: true }} name='name' component={TextField} validate={required} disabled={isDisabled} />
                                </FormControl>
                                <NativeSwitch
                                    disabled={isDisabled}
                                    label={t('form.allow-subordinate-users-switch-label')}
                                    checked={allowSubordinateUsers}
                                    onChange={handleChangeSubordinateUsers}
                                />
                                {allowSubordinateUsers && (
                                    <FormControl>
                                        <Field name='subordinateRoleIds'>
                                            {({ input, meta }) => (
                                                <RolesSelect
                                                    input={input}
                                                    meta={meta}
                                                    label={t('form.subordinate-role-ids-label')}
                                                    isMulti={true}
                                                    disabled={isDisabled}
                                                    required={true}
                                                />
                                            )}
                                        </Field>
                                    </FormControl>
                                )}
                                <Divider>{t('form.permissions-divider')}</Divider>
                                <FormControl>
                                    <InputLabel>{t('form.type-field-label')}</InputLabel>
                                    <Field
                                        subscription={{ value: true }}
                                        name='roleType'
                                        component={SelectField}
                                        options={userRolesOptions}
                                        validate={required}
                                        isClearable={false}
                                        disabled={isDisabled}
                                        callback={(value: string) => {
                                            if (value !== roleType) {
                                                setPermissionState({});
                                                setIsSelectedAllPermissions(false);
                                                setSelectedRoleType(value);
                                            }
                                        }}
                                    />
                                </FormControl>

                                {/* {rolePermissions && ( */}
                                {filteredRolePermissions && (
                                    <>
                                        <SelectAllPermissionsSwitch
                                            selectedRoleType={selectedRoleType}
                                            checked={isSelectedAllPermissions}
                                            callback={handleSelectAllChange}
                                        />
                                        {/* {Object.keys(rolePermissions).map(group => {
                                            const groupPermissions = rolePermissions[group]; */}
                                        {Object.keys(filteredRolePermissions).map(group => {
                                            const groupPermissions = filteredRolePermissions[group];

                                            if (groupPermissions.length === 0) {
                                                return null;
                                            }

                                            const permissionsCurrentValue = permissionState?.[group] || {};
                                            const count = Object.keys(permissionsCurrentValue).filter(key => permissionsCurrentValue[key]).length;

                                            return (
                                                <Accordion
                                                    className={cn('accordion')}
                                                    key={group}
                                                    title={ClientPermissionGroupsMap[group] || AdminPermissionGroupsMap[group] || group}
                                                    rightAddon={<div className={cn('circle-counter', { active: !!count })}>{count}</div>}
                                                >
                                                    {groupPermissions.map(permission => {
                                                        const permissionName = permission.replaceAll('.', '/');

                                                        return (
                                                            <NativeSwitch
                                                                key={permissionName}
                                                                label={ClientPermissionMap[permission] || AdminPermissionsMap[permission] || permission}
                                                                checked={permissionState?.[group] ? permissionState?.[group][permissionName] : false}
                                                                onChange={val => onChangePermission(group, permissionName, val)}
                                                                disabled={isDisabled}
                                                            />
                                                        );
                                                    })}
                                                </Accordion>
                                            );
                                        })}
                                    </>
                                )}
                                {roleType && ![UserRoleType.CARRIER_OWNER, UserRoleType.SHIPPER_OWNER].includes(roleType) && (
                                    <div className={cn('actions')}>
                                        <Button view='primary' type='submit' onClick={handleSubmit}>
                                            {mode === 'create' ? t('form.create-button-label') : t('form.save-settings-button-label')}
                                        </Button>
                                        {mode === 'edit' && (
                                            <Button view='danger' type='button' onClick={onDeleteClickHandler}>
                                                {t('form.delete-button-label')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </form>
                        );
                    }}
                />
            </div>
        </div>
    );
};
