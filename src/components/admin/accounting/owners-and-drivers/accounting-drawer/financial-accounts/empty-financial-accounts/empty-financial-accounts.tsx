import React from 'react';

import { AccountingZoneButton } from '@/components';
import { useDriversActionsPermission } from '@hooks';
import { translateByNamespace } from '@utils';

import { useEmptyFinancialAccounts } from './use-empty-financial-accounts';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts');

export const EmptyFinancialAccounts = () => {
    const { handleEmptyFinancialAccountsClick } = useEmptyFinancialAccounts();
    const hasDriversActionsPermission = useDriversActionsPermission();

    return (
        <AccountingZoneButton
            text={t(hasDriversActionsPermission ? 'add' : 'no-financial-account')}
            onClick={() => handleEmptyFinancialAccountsClick()}
            disabled={!hasDriversActionsPermission}
        />
    );
};
