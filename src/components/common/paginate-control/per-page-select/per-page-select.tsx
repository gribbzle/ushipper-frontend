import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import {SelectField} from '@/fields/select-field';

export const PerPageSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(() => {
        return [20, 50, 100, 200].map(item => ({
            value: item,
            label: item,
        }));
    }, []);

    return <SelectField options={options} {...props} isMulti={false} isClearable={false} menuPlacement='auto' />;
};
