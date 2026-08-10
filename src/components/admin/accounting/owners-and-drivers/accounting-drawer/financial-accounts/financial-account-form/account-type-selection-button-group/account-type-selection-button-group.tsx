import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { Field } from 'react-final-form';

import { SelectionButtonOption } from '@/components/common/selection-button-group/selection-button-group';
import { BalanceType } from '@/enums';
import {SelectionButtonGroupInput} from '@/fields/selection-button-group-input';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const AccountTypeSelectionButtonGroup = ({ ...rest }: { name: string }) => {
    const options: SelectionButtonOption[] = useMemo(
        () =>
            [BalanceType.EXTERNAL_BANK_WALLET, BalanceType.EXTERNAL_CARD_WALLET].map(type => ({
                label: t(`${toKebabCase(type)}-label`),
                value: type,
            })),
        [],
    );

    return <Field {...rest} component={SelectionButtonGroupInput} options={options} />;
};
