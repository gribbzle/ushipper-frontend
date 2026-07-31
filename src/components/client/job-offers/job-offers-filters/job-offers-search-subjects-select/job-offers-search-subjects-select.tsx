import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils/i18n';

import { JobOffersSearchSubject } from './job-offers-search-subjects-select.types';

const t = translateByNamespace('client:order-search-subjects');

const JOB_OFFERS_SEARCH_SUBJECTS: Record<JobOffersSearchSubject, string> = {
    receiver_name: 'receiver_name',
    offering_company_name: 'offering_company_name',
    all: 'all',
};

export const JobOffersSearchSubjectsSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.entries(JOB_OFFERS_SEARCH_SUBJECTS).map(([value, key]) => ({
                label: t(toKebabCase(key)),
                value,
            })),
        [],
    );

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
