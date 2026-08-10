import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { SelectOption } from '@/shared';
import {SelectField} from '@/fields/select-field';
import { useGetCountriesQuery } from '@store/api/countries-api';

export const CountriesSelect = (props: FieldRenderProps<string>) => {
    const { data: countries = [], isLoading } = useGetCountriesQuery();

    const options = useMemo<SelectOption<string>[]>(() => {
        return countries.map(country => ({
            label: country.title,
            value: country.alpha3,
        }));
    }, [countries]);

    return <SelectField<SelectOption<string>[] | string> {...props} options={options} isLoading={isLoading} />;
};
