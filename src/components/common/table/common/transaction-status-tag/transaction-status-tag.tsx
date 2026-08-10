import React, { useMemo } from 'react';

import { FloatingDropdown } from '@/components/common/dropdown/floating-dropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { useTransactionActionsPermission } from '@/hooks/accounting/use-transaction-actions-permission';
import { StatusTag, StatusTagView } from '@/components/ui/data-display/status-tag';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';

import { TransactionStatusTagProps } from './transaction-status-tag-types';
import { useTransactionStatusTag } from './use-transaction-status-tag';

const statusViewMap: Record<TransactionStatusesEnum, StatusTagView> = {
    [TransactionStatusesEnum.NEW]: 'new',
    [TransactionStatusesEnum.PENDING]: 'pending',
    [TransactionStatusesEnum.IN_PROCESS]: 'pending',
    [TransactionStatusesEnum.INSUFFICIENT_FUNDS]: 'pending',
    [TransactionStatusesEnum.TRANSFER_INITIATED]: 'pending',
    [TransactionStatusesEnum.COMPLETED]: 'success',
    [TransactionStatusesEnum.CANCELLED]: 'danger',
    [TransactionStatusesEnum.ERROR]: 'danger',
    [TransactionStatusesEnum.REFUNDED]: 'danger',
};

const t = translateByNamespace('admin:accounting:transactions-page:transaction-status-tag');

export const TransactionStatusTag = ({
    amount,
    status,
    publicId,
    destinationBalance,
    sourceBalance,
    externalProvider,
    type,
    isClickable = true,
}: TransactionStatusTagProps) => {
    const { options, hasOptions, statusText, shouldRenderCompletedCashOutTooltip } = useTransactionStatusTag({
        amount,
        status,
        publicId,
        destinationBalance,
        sourceBalance,
        externalProvider,
        type,
    });

    const hasActionsPermission = useTransactionActionsPermission();
    const active = !shouldRenderCompletedCashOutTooltip && hasActionsPermission && hasOptions && isClickable;
    const statusView = statusViewMap[status] || 'new';

    const statusTrigger = useMemo(() => <StatusTag view={statusView} disabled={!active} label={statusText} />, [statusView, active, statusText]);

    return shouldRenderCompletedCashOutTooltip ? (
        <Tooltip>
            <TooltipTrigger>{statusTrigger}</TooltipTrigger>
            <TooltipContent>{renderTextWithBreakLines(t('help-text'))}</TooltipContent>
        </Tooltip>
    ) : (
        <FloatingDropdown dataTestId='transaction-status-actions' options={options} disabled={!hasActionsPermission || !hasOptions || !isClickable}>
            {statusTrigger}
        </FloatingDropdown>
    );
};
