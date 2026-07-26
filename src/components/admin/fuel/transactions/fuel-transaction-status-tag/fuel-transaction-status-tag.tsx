import React from 'react';

import { FuelTransactionStatus } from '@/enums';
import { FloatingDropdown, StatusBlock, StatusBlockView } from '@components';
import { ArrowDownIcon } from '@icons';
import { getFuelTransactionStatusTranslate } from '@utils';

import { useFuelTransactionStatusTag } from './use-fuel-transaction-status-tag';

export type FuelTransactionStatusTagProps = {
    status: FuelTransactionStatus;
    transactionId: number;
};

const statusViewMap: Record<FuelTransactionStatus, StatusBlockView> = {
    pending: 'warning',
    in_process: 'warning',
    completed: 'success',
};

export const FuelTransactionStatusTag = ({ status, transactionId }: FuelTransactionStatusTagProps) => {
    const { options, disabled } = useFuelTransactionStatusTag({ status, transactionId });

    return (
        <FloatingDropdown dataTestId='fuel-transaction-actions' options={options} disabled={disabled}>
            <StatusBlock view={statusViewMap[status]} isHover={!disabled}>
                {getFuelTransactionStatusTranslate(status)}
                {!disabled && <ArrowDownIcon />}
            </StatusBlock>
        </FloatingDropdown>
    );
};
