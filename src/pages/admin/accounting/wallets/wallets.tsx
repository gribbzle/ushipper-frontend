import React from 'react';

import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { CreateWalletPopup } from '@/components/admin/accounting/wallets/create-wallet-popup/create-wallet-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { WalletsFilters } from '@/components/admin/accounting/wallets/wallets-filters/wallets-filters';
import { WalletsPageHead } from '@/components/admin/accounting/wallets/wallets-page-head/wallets-page-head';
import { WalletsTable } from '@/components/admin/accounting/wallets/wallets-table/wallets-table';

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
