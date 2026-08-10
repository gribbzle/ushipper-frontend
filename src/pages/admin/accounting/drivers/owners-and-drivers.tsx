import React from 'react';

import { BalanceType } from '@/enums';
import { AccountingDrawer } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/accounting-drawer';
import { AccountingEntityFilters } from '@/components/admin/accounting/common/accounting-filters/accounting-entity-filters';
import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { AccountsBalanceStatisticCounters } from '@/components/admin/accounting/common/accounts-balance-statistic-counters/accounts-balance-statistic-counters';
import { AddDriverToCompanyPopup } from '@/components/admin/accounting/owners-and-drivers/add-driver-to-company-popup/add-driver-to-company-popup';
import { AssignDispatcherToDriverPopup } from '@/components/admin/accounting/common/assign-dispatcher-to-driver-popup/assign-dispatcher-to-driver-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeleteAccountPopup } from '@/components/admin/accounting/common/delete-account-popup/delete-account-popup';
import { DeleteUserPopup } from '@/components/client/staff/delete-user-popup/delete-user-popup';
import { DriversMapPopup } from '@/components/admin/accounting/owners-and-drivers/drivers-map-popup/drivers-map-popup';
import { EditFinancialAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/financial-accounts/edit-financial-account-popup/edit-financial-account-popup';
import { EditFuelCardPopup } from '@/components/admin/fuel/cards/edit-fuel-card-popup/edit-fuel-card-popup';
import { EditRocketkorProfileAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/edit-rocketkor-profile-popup/edit-rocketkor-profile-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { LinkFuelCardPopup } from '@/components/admin/accounting/owners-and-drivers/link-fuel-card-popup/link-fuel-card-popup';
import { OwnersAndDriversPageHead } from '@/components/admin/accounting/owners-and-drivers/owners-and-drivers-page-head/owners-and-drivers-page-head';
import { OwnersAndDriversTable } from '@/components/admin/accounting/owners-and-drivers/owners-and-drivers-table/owners-and-drivers-table';
import { UnassignDriverFromFuelCardPopup } from '@/components/admin/fuel/cards/unassign-fuel-card-from-driver-popup/unassign-fuel-card-from-driver-popup';

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
