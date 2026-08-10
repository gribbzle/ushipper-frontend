import React from 'react';

import { BalanceType } from '@/enums/balance-type';
import { AccountingDrawer } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/accounting-drawer';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AddDriverToCompanyPopup } from '@/components/admin/accounting/owners-and-drivers/add-driver-to-company-popup/add-driver-to-company-popup';
import { AlertsFilters } from '@/components/admin/accounting/alerts/alerts-filters/alerts-filters';
import { AlertsPageHead } from '@/components/admin/accounting/alerts/alerts-page-head/alerts-page-head';
import { AlertsTable } from '@/components/admin/accounting/alerts/alerts-table/alerts-table';
import { AlertStatusChangePopup } from '@/components/admin/accounting/alerts/alert-status-change-popup/alert-status-change-popup';
import { AssignDispatcherToDriverPopup } from '@/components/admin/accounting/common/assign-dispatcher-to-driver-popup/assign-dispatcher-to-driver-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeleteUserPopup } from '@/components/client/staff/delete-user-popup/delete-user-popup';
import { EditFinancialAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/financial-accounts/edit-financial-account-popup/edit-financial-account-popup';
import { EditRocketkorProfileAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/edit-rocketkor-profile-popup/edit-rocketkor-profile-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { LinkFuelCardPopup } from '@/components/admin/accounting/owners-and-drivers/link-fuel-card-popup/link-fuel-card-popup';
import { OrderActivityDetailsDrawer } from '@/components/client/orders/drawers/order-activity-details-drawer/order-activity-details-drawer';
import { UnassignDriverFromFuelCardPopup } from '@/components/admin/fuel/cards/unassign-fuel-card-from-driver-popup/unassign-fuel-card-from-driver-popup';

const AlertsPage = () => (
    <>
        <AccountingPageLayout>
            <AlertsFilters />
            <AlertsTable />

            <OrderActivityDetailsDrawer />
            <CreateTransactionPopup context={BalanceType.INTERNAL_USER_WALLET} />
            <EditFinancialAccountPopup />
            <AddDriverToCompanyPopup />
            <AssignDispatcherToDriverPopup />
            <EditRocketkorProfileAccountPopup />
            <DeleteUserPopup />
            <UnassignDriverFromFuelCardPopup />
            <LinkFuelCardPopup />
            <AlertStatusChangePopup />
        </AccountingPageLayout>
        <AccountingDrawer />
    </>
);

AlertsPage.getLayout = getMainLayout({
    head: <AlertsPageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.issues.view_any' }],
});

export default AlertsPage;
