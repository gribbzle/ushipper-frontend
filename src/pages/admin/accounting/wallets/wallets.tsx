import React from 'react';

import { AccountingPageLayout, CreateWalletPopup, getMainLayout, WalletsFilters, WalletsPageHead, WalletsTable } from '@components';

const WalletsPage = () => (
    <AccountingPageLayout>
        <WalletsFilters />
        <WalletsTable />

        <CreateWalletPopup />
    </AccountingPageLayout>
);

WalletsPage.getLayout = getMainLayout({
    head: <WalletsPageHead />,
    permissions: [
        { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.factoring' },
        { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.ushipper' },
        { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.dispatch' },
        { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.cod' },
        { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.broker' },
        { scope: 'adminPanelAccounting', functionality: 'admin_panel.wallets.custom_internal_wallet' },
    ],
});

export default WalletsPage;
