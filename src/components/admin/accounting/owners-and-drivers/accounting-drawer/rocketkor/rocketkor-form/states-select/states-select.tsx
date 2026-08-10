import React, { useMemo } from 'react';
import { FieldRenderProps, useFormState } from 'react-final-form';

import {SelectField} from '@/fields/select-field';
import { useGetStatesQuery } from '@store/api/states-api';

const DEFAULT_STATIC_COUNTRY_CODE = 'USA';

export const StatesSelect = (props: FieldRenderProps<string>) => {
    const {
        values: { country },
    } = useFormState();

    const { data: states } = useGetStatesQuery({ countryCode: country ?? DEFAULT_STATIC_COUNTRY_CODE });
    const options = useMemo(() => states?.map(state => ({ label: state.title, value: state.alpha2 })), [states]);

    return <SelectField {...props} options={options} />;
};
