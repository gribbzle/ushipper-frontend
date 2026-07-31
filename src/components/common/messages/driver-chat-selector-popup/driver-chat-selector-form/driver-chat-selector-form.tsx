import React from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncDriverAccountsSelect } from '@/components/common/selects/async-driver-accounts-select/async-driver-accounts-select';
import { FormControl, InputLabel } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';

import { DriverSelectorFormState, DriverSelectorFormStateProps } from './driver-chat-selector-form.types';
import { useDriverChatSelectorForm } from './use-driver-chat-selector-form';

import './driver-chat-selector-form.scss';

const t = translateByNamespace('common:messages-page:driver-chat-selector-popup');
const cn = classname('driver-chat-selector-form');

export { DriverSelectorFormState, DriverSelectorFormStateProps };

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
