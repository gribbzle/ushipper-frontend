import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingPageLayout,
    AccountingStatisticCounters,
    BalancePageHead,
    CancelRollbackTransactionPopup,
    CODBalanceTable,
    CreateTransactionPopup,
    DeclineOrPayToDriverPopup,
    getMainLayout,
    TransactionsFilters,
} from '@components';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:cod-balance');

const CODBalancePage = () => (
    <AccountingPageLayout>
        <AccountingStatisticCounters type={BalanceType.COD_WALLET} />
        <TransactionsFilters context='cod-balance' />
        <CODBalanceTable />

        <DeclineOrPayToDriverPopup />
        <CreateTransactionPopup context={BalanceType.COD_WALLET} />
        <CancelRollbackTransactionPopup />
    </AccountingPageLayout>
);

CODBalancePage.getLayout = getMainLayout({
    head: (
        <BalancePageHead
            title={t('title', { projectName: getProjectName() })}
            header={t('header')}
            isAddTransactionBtn={true}
            balanceType={BalanceType.COD_WALLET}
        />
    ),
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.cod' }],
});

export default CODBalancePage;
