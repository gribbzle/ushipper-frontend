import React, { useMemo } from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FundsTransferStatus } from '@/enums';
import { SelectField } from '@fields';
import { translateFundsTransferStatus } from '@utils';

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
