import React from 'react';

import { AccountingPageLayout } from '@/components/admin/accounting/common/accounting-page-layout/accounting-page-layout';
import { CODOrdersFilters } from '@/components/admin/accounting/cod-orders/cod-orders-filters/cod-orders-filters';
import { CODOrdersPageHead } from '@/components/admin/accounting/cod-orders/cod-orders-page-head/cod-orders-page-head';
import { CODOrdersTable } from '@/components/admin/accounting/cod-orders/cod-orders-table/cod-orders-table';
import { getMainLayout } from '@/components/common/main-layout/main-layout';

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
