import React from 'react';

import { BalanceType } from '@/enums';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AccountingStatisticCounters } from '@/components/admin/accounting/common/accounting-statistic-counter/accounting-statistic-counters';
import { BalancePageHead } from '@/components/admin/accounting/common/balance-page-head/balance-page-head';
import { CancelRollbackTransactionPopup } from '@/components/admin/accounting/common/cancel-rollback-transaction-popup/cancel-rollback-transaction-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeclineOrPayToDriverPopup } from '@/components/admin/accounting/cod-orders/declined-or-pay-to-driver-popup/declined-or-pay-to-driver-popup';
import { DispatchBalanceTable } from '@/components/admin/accounting/dispatch-balance/dispatch-balance-table/dispatch-balance-table';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { TransactionsFilters } from '@/components/admin/accounting/common/transactions-filters/transactions-filters';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('admin:accounting:dispatch-balance');

const DispatchBalancePage = () => (
    <AccountingPageLayout>
        <AccountingStatisticCounters type={BalanceType.DISPATCH_WALLET} />
        <TransactionsFilters context='dispatch-balance' />

        <DeclineOrPayToDriverPopup />
        <DispatchBalanceTable />
        <CreateTransactionPopup context={BalanceType.DISPATCH_WALLET} />
        <CancelRollbackTransactionPopup />
    </AccountingPageLayout>
);

DispatchBalancePage.getLayout = getMainLayout({
    head: (
        <BalancePageHead
            title={t('title', { projectName: getProjectName() })}
            header={t('header')}
            isAddTransactionBtn={true}
            balanceType={BalanceType.DISPATCH_WALLET}
        />
    ),
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.dispatch' }],
});

export default DispatchBalancePage;
