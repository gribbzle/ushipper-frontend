import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import {SelectField} from '@/fields/select-field';
import { classname } from '@utils/classname';

import './trailer-categories-select.scss';

const cn = classname('trailer-categories-select');

export const TrailerCategoriesSelect = (props: FieldRenderProps<number[]>) => (
    <SelectField<SelectOption<number>[] | undefined>
        input={{
            ...props.input,
            onChange: (val: SelectOption<number>[]) => {
                props.input.onChange(val.map(({ value }) => value));
            },
            value: props.options?.filter(({ value }: { value: number }) => props.input.value.includes(value)),
        }}
        meta={{
            ...props.meta,
            initial: props.options?.filter(({ value }: { value: number }) => {
                if (!props.meta.initial) {
                    return false;
                }

                return props.meta.initial.includes(value);
            }),
        }}
        options={props.options}
        isMulti={true}
        closeMenuOnSelect={false}
        className={cn('')}
    />
);
