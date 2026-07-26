import React from 'react';

import { BalanceType } from '@/enums';
import {
    AccountingDrawer,
    AccountingEntityFilters,
    AccountingPageLayout,
    AccountsBalanceStatisticCounters,
    AddDriverToCompanyPopup,
    AssignDispatcherToDriverPopup,
    CreateTransactionPopup,
    DeleteAccountPopup,
    DeleteUserPopup,
    DriversMapPopup,
    EditFinancialAccountPopup,
    EditFuelCardPopup,
    EditRocketkorProfileAccountPopup,
    getMainLayout,
    LinkFuelCardPopup,
    OwnersAndDriversPageHead,
    OwnersAndDriversTable,
    UnassignDriverFromFuelCardPopup,
} from '@components';

const OwnersAndDriversPage = () => (
    <>
        <AccountingPageLayout>
            <AccountsBalanceStatisticCounters accountRole='driver' />
            <AccountingEntityFilters />
            <OwnersAndDriversTable />

            <AccountingDrawer />
            <DeleteUserPopup />
            <CreateTransactionPopup context={BalanceType.INTERNAL_USER_WALLET} />
            <EditFinancialAccountPopup />
            <AddDriverToCompanyPopup />
            <AssignDispatcherToDriverPopup />
            <EditRocketkorProfileAccountPopup />
            <DriversMapPopup />
            <DeleteAccountPopup />
            <UnassignDriverFromFuelCardPopup />
            <LinkFuelCardPopup />
            <EditFuelCardPopup />
        </AccountingPageLayout>
    </>
);

OwnersAndDriversPage.getLayout = getMainLayout({
    head: <OwnersAndDriversPageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.drivers.view_any' }],
});

export default OwnersAndDriversPage;
