import React from 'react';

import {
    FuelPageLayout,
    FuelTransactionDetailsDrawer,
    FuelTransactionsFilters,
    FuelTransactionsPageHead,
    FuelTransactionsTable,
    getMainLayout,
} from '@components';

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
