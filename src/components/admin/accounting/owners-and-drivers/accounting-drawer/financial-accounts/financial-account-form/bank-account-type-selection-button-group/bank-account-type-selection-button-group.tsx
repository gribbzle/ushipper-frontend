import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { AccountSubTypesEnum } from '@/enums';
import {SelectionButtonGroupInput} from '@/fields/selection-button-group-input';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const BankAccountTypeSelectionButtonGroup = ({ ...rest }: { name: string }) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            [AccountSubTypesEnum.CHECKING, AccountSubTypesEnum.SAVING].map(type => ({
                label: t(`${toKebabCase(type)}-label`),
                value: type,
            })),
        [],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
