import React from 'react';
import { Field, Form } from 'react-final-form';

import { Divider, DriversSelect } from '@components';
import { FormControl, InputLabel, NativeSwitch, TextField } from '@fields';
import { classname, FormValuesSpy, translateByNamespace } from '@utils';

import { SDDriversSelect } from './sd-drivers-select';
import { AssignDriverFormState, useAssignDriverForm } from './use-assign-driver-form';

import './assign-driver-form.scss';

const t = translateByNamespace('client:loadboard:checking-contract-popup');
const cn = classname('assign-driver-form');

export const AssignDriverForm = ({ isFull }: { isFull: boolean }) => {
    const { onChangeFormValue, onChangeIsAssignDriver, isAssignDriver, formRef } = useAssignDriverForm();

    return (
        <Form<AssignDriverFormState>
            subscription={{ values: true }}
            initialValues={{ assignedDriverIds: [] }}
            onSubmit={() => undefined}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn('')}>
                        <FormValuesSpy onChange={onChangeFormValue} debounceTime={300} />
                        <div className={cn('driver-wrapper', { column: isFull })}>
                            <FormControl>
                                <NativeSwitch
                                    checked={isAssignDriver}
                                    onChange={onChangeIsAssignDriver}
                                    label={t(`${isFull ? 'assign-drivers-label' : 'assign-driver-label'}`)}
                                />
                            </FormControl>
                            {isAssignDriver && (
                                <FormControl className={cn('driver')}>
                                    {isFull && <InputLabel>{t('assign-ushipper-driver-label')}</InputLabel>}
                                    <Field
                                        name='assignedDriverIds'
                                        component={DriversSelect}
                                        closeMenuOnSelect={true}
                                        isClearable={true}
                                        isMulti={false}
                                        placeholder=''
                                    />
                                </FormControl>
                            )}
                        </div>
                        {isFull && isAssignDriver && (
                            <>
                                <Divider>{t('sd-divider')}</Divider>

                                <FormControl className={cn('driver')}>
                                    <InputLabel>{t('assign-sd-driver-label')}</InputLabel>
                                    <Field
                                        name='externalAssignedDriverId'
                                        component={SDDriversSelect}
                                        closeMenuOnSelect={true}
                                        isClearable={true}
                                        isMulti={false}
                                        placeholder=''
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel>{t('note-label')}</InputLabel>
                                    <Field name='note' component={TextField} placeholder='' multiline={true} resize='none' />
                                </FormControl>
                            </>
                        )}
                    </form>
                );
            }}
        />
    );
};
