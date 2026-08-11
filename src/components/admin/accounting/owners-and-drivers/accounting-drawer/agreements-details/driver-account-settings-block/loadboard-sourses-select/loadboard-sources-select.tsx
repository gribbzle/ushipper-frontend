import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { SelectOption } from '@/shared/types';
import {SelectField} from '@/fields/select-field';
import { translateOrderSource } from '@utils/translate/order/translate-order-source';

export const LoadboardSourcesSelect = (props: FieldRenderProps<string>) => {
    const options = Object.values(OrderSourcesEnum)
        .filter(source => source !== OrderSourcesEnum.CENTRAL_DISPATCH)
        .map(source => ({
            label: translateOrderSource(source),
            value: source,
        }));

    return (
        <SelectField
            options={options}
            {...props}
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
