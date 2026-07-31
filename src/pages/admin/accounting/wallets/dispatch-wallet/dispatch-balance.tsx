import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingPageLayout,
    AccountingStatisticCounters,
    BalancePageHead,
    CancelRollbackTransactionPopup,
    CreateTransactionPopup,
    DeclineOrPayToDriverPopup,
    DispatchBalanceTable,
    getMainLayout,
    TransactionsFilters,
} from '@components';
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
