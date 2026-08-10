import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { BalanceType } from '@/enums/balance-type';
import {SelectField} from '@/fields/select-field';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const AccountTypesSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            [BalanceType.EXTERNAL_BANK_WALLET, BalanceType.EXTERNAL_CARD_WALLET].map(type => ({
                label: t(`${toKebabCase(type)}-label`),
                value: type,
            })),
        [],
    );

    return <SelectField {...props} options={options} />;
};
