import React from 'react';

import { FuelPageLayout } from '@/components/admin/fuel/fuel-page-layout/fuel-page-layout';
import { FuelTransactionDetailsDrawer } from '@/components/admin/fuel/transactions/fuel-transaction-details-drawer/fuel-transaction-details-drawer';
import { FuelTransactionsFilters } from '@/components/admin/fuel/transactions/fuel-transactions-filters/fuel-transactions-filters';
import { FuelTransactionsPageHead } from '@/components/admin/fuel/transactions/transactions-page-head/transactions-page-head';
import { FuelTransactionsTable } from '@/components/admin/fuel/transactions/transactions-table/transactions-table';
import { getMainLayout } from '@/components/common/main-layout/main-layout';

const FuelTransactionsPage = () => (
    <FuelPageLayout>
        <FuelTransactionsFilters />
        <FuelTransactionsTable />

        <FuelTransactionDetailsDrawer />
    </FuelPageLayout>
);

FuelTransactionsPage.getLayout = getMainLayout({
    head: <FuelTransactionsPageHead />,
    permissions: [{ scope: 'fuelCards', functionality: 'admin_panel.fuel_cards.transactions.view_any' }],
});

export default FuelTransactionsPage;
