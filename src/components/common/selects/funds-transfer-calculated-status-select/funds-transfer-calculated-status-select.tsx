import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { FundsTransferCalculatedStatus } from '@/enums';
import {SelectField} from '@/fields/select-field';
import { translateFundsTransferCalculatedStatus } from '@utils/translate/order/translate-funds-transfer-calculated-status';

const ALLOWED_STATUSES: FundsTransferCalculatedStatus[] = [
    FundsTransferCalculatedStatus.PENDING,
    FundsTransferCalculatedStatus.PENDING_DELIVERY,
    FundsTransferCalculatedStatus.READY_FOR_FACTORING,
    FundsTransferCalculatedStatus.FACTORING_REQUESTED,
    FundsTransferCalculatedStatus.PENDING_DOCUMENTS,
    FundsTransferCalculatedStatus.PENDING_APPROVAL,
    FundsTransferCalculatedStatus.FACTORING_CONFIRMED,
    FundsTransferCalculatedStatus.PAID,
    FundsTransferCalculatedStatus.DAMAGE_CLAIM,
];

export const FundsTransferCalculatedStatusSelect = (props: FieldRenderProps<string>) => {
    const options = ALLOWED_STATUSES.map(val => ({
        label: translateFundsTransferCalculatedStatus(val === FundsTransferCalculatedStatus.PENDING ? FundsTransferCalculatedStatus.NOT_PAID : val),
        value: val,
    }));

    return <SelectField options={options} displayAllOptions={true} {...props} />;
};
