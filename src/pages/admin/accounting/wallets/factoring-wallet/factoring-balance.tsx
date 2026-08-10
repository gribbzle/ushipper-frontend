import React from 'react';

import { BalanceType } from '@/enums/balance-type';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AccountingStatisticCounters } from '@/components/admin/accounting/common/accounting-statistic-counter/accounting-statistic-counters';
import { BalancePageHead } from '@/components/admin/accounting/common/balance-page-head/balance-page-head';
import { CancelRollbackTransactionPopup } from '@/components/admin/accounting/common/cancel-rollback-transaction-popup/cancel-rollback-transaction-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeclineOrPayToDriverPopup } from '@/components/admin/accounting/cod-orders/declined-or-pay-to-driver-popup/declined-or-pay-to-driver-popup';
import { FactoringBalanceTable } from '@/components/admin/accounting/factoring-balance/factoring-balance-table/factoring-balance-table';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { TransactionsFilters } from '@/components/admin/accounting/common/transactions-filters/transactions-filters';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

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
