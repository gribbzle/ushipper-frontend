import React from 'react';

import { BalanceType } from '@/enums';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AccountingStatisticCounters } from '@/components/admin/accounting/common/accounting-statistic-counter/accounting-statistic-counters';
import { BalancePageHead } from '@/components/admin/accounting/common/balance-page-head/balance-page-head';
import { CancelRollbackTransactionPopup } from '@/components/admin/accounting/common/cancel-rollback-transaction-popup/cancel-rollback-transaction-popup';
import { CODBalanceTable } from '@/components/admin/accounting/cod-balance/cod-balance-table/cod-balance-table';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeclineOrPayToDriverPopup } from '@/components/admin/accounting/cod-orders/declined-or-pay-to-driver-popup/declined-or-pay-to-driver-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { TransactionsFilters } from '@/components/admin/accounting/common/transactions-filters/transactions-filters';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

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
