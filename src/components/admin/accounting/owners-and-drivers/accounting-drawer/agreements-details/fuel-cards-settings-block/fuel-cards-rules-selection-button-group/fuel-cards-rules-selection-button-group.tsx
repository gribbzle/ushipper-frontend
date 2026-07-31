import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { FuelCardsRule } from '@/enums';
import { SelectionButtonGroupInput } from '@fields';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements:fuel-cards-settings');

export const FuelCardsRulesSelectionButtonGroup = ({ ...rest }: { name: string; disabled?: boolean }) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            Object.values(FuelCardsRule).map(rule => ({
                label: t(`${rule}-label`),
                value: rule,
            })),
        [],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
