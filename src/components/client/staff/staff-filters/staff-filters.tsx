import React, { memo } from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncCompanySelect } from '@/components/common/company-select/async-company-select';
import { SelectionGroup } from '@/components/common/selection-group/selection-group';
import { RolesSelect } from '@/components/common/selects/roles-select/roles-select';
import { UserStatusesSelect } from '@/components/common/selects/user-statuses-select/user-statuses-select';
import { FormControl, InputLabel, TextField } from '@fields';
import { ListIcon, TreeIcon } from '@icons';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { StaffFiltersFormProps, StaffFiltersFormState } from './staff-filters.types';
import { useStaffFiltersForm } from './use-staff-filters-form';

import './staff-filters.scss';

const t = translateByNamespace('common:staff-filters');

const cn = classname('staff-filters');

export const StaffFiltersForm = memo(
    ({ isRoleFieldVisible = false, onViewChange, isEmailFieldVisible = false, isCompanyFieldVisible = false }: StaffFiltersFormProps) => {
        const { onChangeHandler, formRef } = useStaffFiltersForm();

        return (
            <Form<StaffFiltersFormState>
                onSubmit={onChangeHandler}
                subscription={{ values: true }}
                render={({ handleSubmit, form }) => {
                    formRef.current = form;

                    return (
                        <form onSubmit={handleSubmit} className={cn()}>
                            <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                            <FormControl>
                                <InputLabel>{t('name-field-label')}</InputLabel>
                                <Field name='name' component={TextField} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('phone-field-label')}</InputLabel>
                                <Field name='phone' component={TextField} />
                            </FormControl>
                            {isEmailFieldVisible && (
                                <FormControl>
                                    <InputLabel>{t('email-field-label')}</InputLabel>
                                    <Field name='email' component={TextField} />
                                </FormControl>
                            )}
                            {isRoleFieldVisible && (
                                <Field name='roleId'>
                                    {({ input, meta }) => (
                                        <RolesSelect input={input} meta={meta} label={t('role-field-label')} isMulti={false} required={false} />
                                    )}
                                </Field>
                            )}
                            {isCompanyFieldVisible && (
                                <FormControl>
                                    <InputLabel>{t('company-field-label')}</InputLabel>
                                    <Field name='companyName' component={AsyncCompanySelect} valueField='name' />
                                </FormControl>
                            )}
                            <FormControl>
                                <InputLabel>{t('status-field-label')}</InputLabel>
                                <Field name='status' component={UserStatusesSelect} />
                            </FormControl>
                            {onViewChange && (
                                <SelectionGroup
                                    defaultValue='tree'
                                    items={[
                                        { value: 'list', icon: <ListIcon /> },
                                        { value: 'tree', icon: <TreeIcon /> },
                                    ]}
                                    onChange={onViewChange}
                                />
                            )}
                        </form>
                    );
                }}
            />
        );
    },
);

StaffFiltersForm.displayName = 'StaffFiltersForm';
