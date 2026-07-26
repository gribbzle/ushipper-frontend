import React from 'react';

import { AccountingPageLayout, CODOrdersFilters, CODOrdersPageHead, CODOrdersTable, getMainLayout } from '@components';

const CODOrdersPage = () => (
    <AccountingPageLayout>
        <CODOrdersFilters />
        <CODOrdersTable />
    </AccountingPageLayout>
);

CODOrdersPage.getLayout = getMainLayout({
    head: <CODOrdersPageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.accounting.cod_cop_orders' }],
});

export default CODOrdersPage;
