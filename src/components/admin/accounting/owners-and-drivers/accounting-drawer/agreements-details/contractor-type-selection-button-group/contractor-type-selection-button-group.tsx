import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { ContractorTypesEnum } from '@/enums';
import { SelectionButtonGroupInput } from '@fields';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:agreements');

export const ContractorTypeSelectionButtonGroup = ({ ...rest }: { name: string; disabled?: boolean }) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            Object.values(ContractorTypesEnum).map(type => ({
                label: t(`${toKebabCase(type)}-label`),
                value: type,
            })),
        [],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
