import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingDrawer,
    AccountingPageLayout,
    AddDriverToCompanyPopup,
    AlertsFilters,
    AlertsPageHead,
    AlertsTable,
    AlertStatusChangePopup,
    AssignDispatcherToDriverPopup,
    CreateTransactionPopup,
    DeleteUserPopup,
    EditFinancialAccountPopup,
    EditRocketkorProfileAccountPopup,
    getMainLayout,
    LinkFuelCardPopup,
    OrderActivityDetailsDrawer,
    UnassignDriverFromFuelCardPopup,
} from '@components';

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
