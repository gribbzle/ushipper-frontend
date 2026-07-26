import React from 'react';

import { getMainLayout } from '@components';

import { BlackListPageHead } from '../black-list-head';
import { BlackListPageLayout } from '../black-list-page-layout';

const AdminBlackListPage = () => <BlackListPageLayout />;

AdminBlackListPage.getLayout = getMainLayout({
    head: <BlackListPageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.black_list_items.view_any' }],
});

export default AdminBlackListPage;
