import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingPageLayout,
    AccountingStatisticCounters,
    BalancePageHead,
    CancelRollbackTransactionPopup,
    CreateTransactionPopup,
    DeclineOrPayToDriverPopup,
    FactoringBalanceTable,
    getMainLayout,
    TransactionsFilters,
} from '@components';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:factoring-balance');

const FactoringBalancePage = () => (
    <AccountingPageLayout>
        <AccountingStatisticCounters type={BalanceType.FACTORING_WALLET} />
        <TransactionsFilters context='factoring-balance' />
        <FactoringBalanceTable />

        <DeclineOrPayToDriverPopup />
        <CreateTransactionPopup context={BalanceType.FACTORING_WALLET} />
        <CancelRollbackTransactionPopup />
    </AccountingPageLayout>
);

FactoringBalancePage.getLayout = getMainLayout({
    head: (
        <BalancePageHead
            title={t('title', { projectName: getProjectName() })}
            header={t('header')}
            isAddTransactionBtn={true}
            balanceType={BalanceType.FACTORING_WALLET}
        />
    ),
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.factoring' }],
});

export default FactoringBalancePage;
