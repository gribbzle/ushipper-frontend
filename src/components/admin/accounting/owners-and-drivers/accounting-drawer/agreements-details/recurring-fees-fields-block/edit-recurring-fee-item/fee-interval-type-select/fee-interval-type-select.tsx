import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { RecurringIntervalType } from '@enums';
import { SelectField } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:fee-interval-types');

export const FeeIntervalTypeSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(RecurringIntervalType).map(interval => ({
                label: t(interval),
                value: interval,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
