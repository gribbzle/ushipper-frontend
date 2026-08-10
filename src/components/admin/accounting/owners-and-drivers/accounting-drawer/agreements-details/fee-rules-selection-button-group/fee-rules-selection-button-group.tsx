import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { FeesRule } from '@/enums';
import {SelectionButtonGroupInput} from '@/fields/selection-button-group-input';
import { translateByNamespace } from '@utils/i18n';

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
