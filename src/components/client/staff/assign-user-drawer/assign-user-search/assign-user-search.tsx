import React from 'react';
import { Field, Form } from 'react-final-form';

import { TextField } from '@fields';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { AssignUserSearchProps, AssignUserSearchState } from './assign-user-search.types';
import { useAssignUserSearch } from './use-assign-user-search';

import './assign-user-search.scss';

const cn = classname('assign-user-search');
const t = translateByNamespace('common:staff-table');

export const AssignUserSearch = ({ onChange, initValue }: AssignUserSearchProps) => {
    const { onChangeHandler } = useAssignUserSearch({ onChange, initValue });

    return (
        <Form<AssignUserSearchState>
            onSubmit={onChangeHandler}
            subscription={{ values: true }}
            initialValues={{ name: initValue }}
            render={({ handleSubmit }) => (
                <form className={cn('')} onSubmit={handleSubmit}>
                    <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                    <Field name='name' placeholder={t('enter-name')} component={TextField} />
                </form>
            )}
        />
    );
};
