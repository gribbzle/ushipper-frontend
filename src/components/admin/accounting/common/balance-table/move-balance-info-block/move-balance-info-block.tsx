import React, { useCallback } from 'react';

import { useDriversViewPermission } from '@/hooks/accounting/use-drivers-view-permission';
import { useHandleOpenAccountingDrawerClick } from '@/hooks/accounting/use-handle-open-accounting-drawer-click';
import { TransactionBalanceResource } from '@store/admin';
import { classname } from '@utils/classname';

import './move-balance-info-block.scss';

const cn = classname('move-balance-info-block');

export const MoveBalanceInfoBlock = ({ balance }: { balance: TransactionBalanceResource | null }) => {
    const { name, accountName, accountId } = balance || {};
    const hasDriversViewPermission = useDriversViewPermission();
    const onOpenAccountingDrawer = useHandleOpenAccountingDrawerClick();

    const onClickHandler = useCallback(async () => {
        if (hasDriversViewPermission && accountId) {
            onOpenAccountingDrawer(accountId);
        }
    }, [hasDriversViewPermission, accountId, onOpenAccountingDrawer]);

    if (!name) {
        return <span>—</span>;
    }

    return (
        <div className={cn('')}>
            {accountName && (
                <span className={cn('account', { disabled: !hasDriversViewPermission })} onClick={onClickHandler}>
                    {accountName}
                </span>
            )}
            <span>{name}</span>
        </div>
    );
};
