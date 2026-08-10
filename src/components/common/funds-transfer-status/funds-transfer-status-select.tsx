import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FundsTransferStatus } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { translateFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';

export const FundsTransferStatusSelect = (props: FieldRenderProps<string>) => {
    const options = useMemo(
        () =>
            Object.values(FundsTransferStatus).map(val => ({
                label: translateFundsTransferStatus(val),
                value: val,
            })),
        [],
    );

    return <SelectField options={options} {...props} />;
};
