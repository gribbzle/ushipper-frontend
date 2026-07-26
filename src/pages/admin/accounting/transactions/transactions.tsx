import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingDrawer,
    AccountingPageLayout,
    AddDriverToCompanyPopup,
    AssignDispatcherToDriverPopup,
    BalancePageHead,
    CancelRollbackTransactionPopup,
    CreateTransactionPopup,
    DeclineOrPayToDriverPopup,
    DeleteUserPopup,
    EditFinancialAccountPopup,
    EditRocketkorProfileAccountPopup,
    getMainLayout,
    LinkFuelCardPopup,
    TransactionsFilters,
    TransactionsTable,
    UnassignDriverFromFuelCardPopup,
} from '@components';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:transactions-page');

const TransactionsPage = () => (
    <AccountingPageLayout>
        <TransactionsFilters context='transactions' />
        <TransactionsTable />

        <DeclineOrPayToDriverPopup />
        <AccountingDrawer />
        <CancelRollbackTransactionPopup />
        <CreateTransactionPopup context={BalanceType.INTERNAL_USER_WALLET} />
        <AddDriverToCompanyPopup />
        <EditFinancialAccountPopup />
        <AssignDispatcherToDriverPopup />
        <DeleteUserPopup />
        <UnassignDriverFromFuelCardPopup />
        <EditRocketkorProfileAccountPopup />
        <LinkFuelCardPopup />
    </AccountingPageLayout>
);

TransactionsPage.getLayout = getMainLayout({
    head: <BalancePageHead title={t('title', { projectName: getProjectName() })} header={t('header')} />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.transactions.view_any' }],
});

export default TransactionsPage;
