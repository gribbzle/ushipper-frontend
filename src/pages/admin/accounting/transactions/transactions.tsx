import React from 'react';

import { BalanceType } from '@/enums';
import { AccountingDrawer } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/accounting-drawer';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AddDriverToCompanyPopup } from '@/components/admin/accounting/owners-and-drivers/add-driver-to-company-popup/add-driver-to-company-popup';
import { AssignDispatcherToDriverPopup } from '@/components/admin/accounting/common/assign-dispatcher-to-driver-popup/assign-dispatcher-to-driver-popup';
import { BalancePageHead } from '@/components/admin/accounting/common/balance-page-head/balance-page-head';
import { CancelRollbackTransactionPopup } from '@/components/admin/accounting/common/cancel-rollback-transaction-popup/cancel-rollback-transaction-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeclineOrPayToDriverPopup } from '@/components/admin/accounting/cod-orders/declined-or-pay-to-driver-popup/declined-or-pay-to-driver-popup';
import { DeleteUserPopup } from '@/components/client/staff/delete-user-popup/delete-user-popup';
import { EditFinancialAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/financial-accounts/edit-financial-account-popup/edit-financial-account-popup';
import { EditRocketkorProfileAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/edit-rocketkor-profile-popup/edit-rocketkor-profile-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { LinkFuelCardPopup } from '@/components/admin/accounting/owners-and-drivers/link-fuel-card-popup/link-fuel-card-popup';
import { TransactionsFilters } from '@/components/admin/accounting/common/transactions-filters/transactions-filters';
import { TransactionsTable } from '@/components/admin/accounting/transactions-page/transactions-table/transactions-table';
import { UnassignDriverFromFuelCardPopup } from '@/components/admin/fuel/cards/unassign-fuel-card-from-driver-popup/unassign-fuel-card-from-driver-popup';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

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
