import React from 'react';

import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { StatusBlock } from '@/components/common/status-block/status-block';
import { StatusBlockView } from '@/components/common/status-block/status-block';
import { FuelTransactionStatus } from '@/enums';
import { ArrowDownIcon } from '@icons';
import { getFuelTransactionStatusTranslate } from '@utils/translate/fuel/get-fuel-transaction-status-translate';

import { FuelTransactionStatusTagProps } from './fuel-transaction-status-tag.types';
import { useFuelTransactionStatusTag } from './use-fuel-transaction-status-tag';

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
