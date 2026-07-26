import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { FeesRule } from '@/enums';
import { SelectionButtonOption } from '@components';
import { SelectionButtonGroupInput } from '@fields';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');

export const FeeRulesSelectionButtonGroup = ({ ...rest }: { name: string; disabled?: boolean }) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            Object.values(FeesRule).map(rules => ({
                label: t(`${rules}-label`),
                value: rules,
            })),
        [],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
