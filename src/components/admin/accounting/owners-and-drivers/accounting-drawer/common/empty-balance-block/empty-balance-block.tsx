import React from 'react';

import { EmptyRocketkor } from '@/components/admin/accounting/common/empty-rocketkor';
import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { classname } from '@utils/classname';

import { useEmptyAccountBalanceBlock } from './use-empty-balance-block';

import './empty-balance-block.scss';

const cn = classname('empty-balance-block');

export const EmptyBalanceBlock = () => {
    const { hasDriversActionsPermission, alertText, handleEmptyRocketkorClick } = useEmptyAccountBalanceBlock();

    return (
        <div className={cn()}>
            <AlertBlock>
                <span>{alertText}</span>
            </AlertBlock>
            {hasDriversActionsPermission && <EmptyRocketkor onChange={() => handleEmptyRocketkorClick()} />}
        </div>
    );
};
