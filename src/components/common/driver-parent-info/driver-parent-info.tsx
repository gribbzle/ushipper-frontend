import React, { useCallback } from 'react';

import { useIsAdminPage } from '@hooks';
import { DriverParent } from '@store/common';
import { classname, formatToCurrency, getBalanceInfo, translateByNamespace } from '@utils';

import './driver-parent-info.scss';

const t = translateByNamespace('client:order:order-information');
const cn = classname('driver-parent-info');

type Props = {
    parent: DriverParent;
    disabled?: boolean;
    isFulled?: boolean;
    size?: 'small';
};

export const DriverParentInfo = ({ parent, disabled = false, isFulled = true, size }: Props) => {
    const isAdminPage = useIsAdminPage();

    const onDriverParentNameClickHandler = useCallback(
        (name: string) => window.open(`/admin/accounting/drivers?name=${encodeURIComponent(name)}`, '_blank'),
        [],
    );

    const { name, defaultBalance } = parent;
    const parentBalanceData = defaultBalance ? getBalanceInfo(defaultBalance.displayedBalance.amount) : null;
    const { balanceValue, isSuccess, isDanger, isAwaiting } = parentBalanceData || {};

    return (
        <div className={cn('description', { disabled, size })}>
            {t('owner-label')}:{' '}
            <span className={cn('parent', { hover: isAdminPage, disabled })} onClick={isAdminPage ? () => onDriverParentNameClickHandler(name) : undefined}>
                {name}
            </span>{' '}
            {isFulled && defaultBalance && (
                <span className={cn('description', { disabled, success: isSuccess, awaiting: isAwaiting, danger: isDanger })}>
                    ({formatToCurrency(balanceValue)})
                </span>
            )}
        </div>
    );
};
