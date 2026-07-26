import React from 'react';

import { FloatingDropdown, OrderTag } from '@components';
import { useIssue, useTransactionActionsPermission } from '@hooks';
import { ArrowDownIcon } from '@icons';
import { classname, diffForHumans, translateByNamespace } from '@utils';

import { useAlertStatusTag } from './use-alert-status-tag';

import './alert-status-tag.scss';

const cn = classname('alert-status-tag');
const t = translateByNamespace('common:issue-status');

export const AlertStatusTag = () => {
    const { status, processedAt } = useIssue();
    const { variant, options } = useAlertStatusTag();
    const hasTransactionsActionsPermission = useTransactionActionsPermission();

    return (
        <div className={cn('wrapper')}>
            <FloatingDropdown dataTestId='alert-actions' options={options} disabled={!hasTransactionsActionsPermission}>
                <OrderTag view={variant} isHover={hasTransactionsActionsPermission} size='large'>
                    {t(status)} {hasTransactionsActionsPermission && <ArrowDownIcon className={cn('dropdown-icon')} />}
                </OrderTag>
            </FloatingDropdown>
            {processedAt && <span className={cn('time')}> {diffForHumans(new Date(processedAt), true)}</span>}
        </div>
    );
};
