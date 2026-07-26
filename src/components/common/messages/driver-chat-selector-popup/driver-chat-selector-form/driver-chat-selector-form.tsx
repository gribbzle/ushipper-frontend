import React, { MutableRefObject } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { AsyncDriverAccountsSelect } from '@components';
import { FormControl, InputLabel } from '@fields';
import { classname, parseField, translateByNamespace } from '@utils';

import { useDriverChatSelectorForm } from './use-driver-chat-selector-form';

import './driver-chat-selector-form.scss';

const t = translateByNamespace('common:messages-page:driver-chat-selector-popup');
const cn = classname('driver-chat-selector-form');

export type DriverSelectorFormState = {
    driverId: string;
};

export type DriverSelectorFormStateProps = {
    onAfterSubmit: () => void;
    formRef: MutableRefObject<FormApi<DriverSelectorFormState> | undefined>;
};

export const DriverSelectorForm = ({ formRef, onAfterSubmit }: DriverSelectorFormStateProps) => {
    const { onSubmit, setSelectedDriverName } = useDriverChatSelectorForm({ onAfterSubmit });

    return (
        <Form<DriverSelectorFormState>
            subscription={{ values: true }}
            initialValues={{}}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormControl>
                            <InputLabel required={true}>{t('driver-label')}</InputLabel>
                            <Field
                                parse={parseField}
                                name='driverId'
                                placeholder=''
                                component={AsyncDriverAccountsSelect}
                                isClearable={true}
                                callback={setSelectedDriverName}
                            />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
