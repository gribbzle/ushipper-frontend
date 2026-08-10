import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import {SelectField} from '@/fields/select-field';
import { useGetSpecializationsQuery } from '@store/api/specializations-api';
import { classname } from '@utils/classname';
import { getTransportServiceTranslate } from '@utils/specialization';

import './transport-service-select.scss';

const cn = classname('transport-service-select');

export const TransportServiceSelect = (props: FieldRenderProps<number[]>) => {
    const { data: specializations = [], isLoading } = useGetSpecializationsQuery();

    const specializationsOptions = useMemo<SelectOption<number>[]>(
        () => specializations.map(specialization => ({ label: getTransportServiceTranslate(specialization.name), value: specialization.id })),
        [specializations],
    );

    return (
        <SelectField<SelectOption<number>[] | undefined>
            isMulti={true}
            {...props}
            options={specializationsOptions}
            isLoading={isLoading}
            input={{
                ...props.input,
                onChange: (val: SelectOption<number>[]) => {
                    props.input.onChange(val.map(({ value }) => value));
                },
                value: specializationsOptions?.filter(({ value }) => props.input.value.includes(value)),
            }}
            meta={{
                ...props.meta,
                initial: specializationsOptions?.filter(({ value }) => {
                    if (!props.meta.initial) {
                        return false;
                    }

                    return props.meta.initial.includes(value);
                }),
            }}
            className={cn('')}
        />
    );
};
