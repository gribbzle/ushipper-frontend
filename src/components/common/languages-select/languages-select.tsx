import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import { SelectField } from '@fields';
import { useGetLanguagesQuery } from '@store/api/languages-api';

export const LanguagesSelect = (props: FieldRenderProps<string>) => {
    const { data: languages = [], isLoading } = useGetLanguagesQuery();

    const options = useMemo<SelectOption<string>[]>(() => {
        return languages.map(language => ({
            label: language.title,
            value: language.code,
        }));
    }, [languages]);

    return (
        <SelectField<SelectOption<string>[] | string>
            isMulti={true}
            {...props}
            options={options}
            isLoading={isLoading}
            input={{
                ...props.input,
                onChange: (val: SelectOption<string>[]) => {
                    props.input.onChange(val.map(({ value }) => value));
                },
                value: options?.filter(({ value }) => props.input.value.includes(value)),
            }}
            meta={{
                ...props.meta,
                initial: options?.filter(({ value }) => {
                    if (!props.meta.initial) {
                        return false;
                    }

                    return props.meta.initial.includes(value);
                }),
            }}
        />
    );
};
