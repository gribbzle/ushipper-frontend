import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingPageLayout,
    AccountingStatisticCounters,
    BalancePageHead,
    CancelRollbackTransactionPopup,
    CreateTransactionPopup,
    DeclineOrPayToDriverPopup,
    getMainLayout,
    TransactionsFilters,
    UshipperBalanceTable,
} from '@components';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('admin:accounting:ushipper-balance');

const UshipperBalancePage = () => (
    <AccountingPageLayout>
        <AccountingStatisticCounters type={BalanceType.USHIPPER_WALLET} />
        <TransactionsFilters context='ushipper-balance' />
        <UshipperBalanceTable />

        <DeclineOrPayToDriverPopup />
        <CreateTransactionPopup context={BalanceType.USHIPPER_WALLET} />
        <CancelRollbackTransactionPopup />
    </AccountingPageLayout>
);

UshipperBalancePage.getLayout = getMainLayout({
    head: (
        <BalancePageHead
            title={t('title', { projectName: getProjectName() })}
            header={t('header')}
            isAddTransactionBtn={true}
            balanceType={BalanceType.USHIPPER_WALLET}
        />
    ),
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.ushipper' }],
});

export default UshipperBalancePage;
