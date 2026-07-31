import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingPageLayout,
    AccountingStatisticCounters,
    BalancePageHead,
    BrokerFeeBalanceTable,
    CancelRollbackTransactionPopup,
    CreateTransactionPopup,
    DeclineOrPayToDriverPopup,
    getMainLayout,
    TransactionsFilters,
} from '@components';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('admin:accounting:broker-fee-balance');

const BrokerFeeBalancePage = () => (
    <AccountingPageLayout>
        <AccountingStatisticCounters type={BalanceType.BROKER_WALLET} />
        <TransactionsFilters context='broker-fee-balance' />

        <DeclineOrPayToDriverPopup />
        <BrokerFeeBalanceTable />
        <CreateTransactionPopup context={BalanceType.BROKER_WALLET} />
        <CancelRollbackTransactionPopup />
    </AccountingPageLayout>
);

BrokerFeeBalancePage.getLayout = getMainLayout({
    head: (
        <BalancePageHead
            title={t('title', { projectName: getProjectName() })}
            header={t('header')}
            isAddTransactionBtn={true}
            balanceType={BalanceType.BROKER_WALLET}
        />
    ),
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.broker' }],
});

export default BrokerFeeBalancePage;
