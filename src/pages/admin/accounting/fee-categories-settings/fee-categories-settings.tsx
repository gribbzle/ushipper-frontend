import React from 'react';

import { CreateEditFeeCategoryBlock } from '@/components/admin/accounting/fee-categories-settings/create-edit-fee-category-block/create-edit-fee-category-block';
import { DeleteFeeCategoryPopup } from '@/components/admin/accounting/fee-categories-settings/delete-fee-category-popup/delete-fee-category-popup';
import { FeeCategoriesSettingsPageHead } from '@/components/admin/accounting/fee-categories-settings/fee-categories-settings-page-head/fee-categories-settings-page-head';
import { FeeCategoriesTable } from '@/components/admin/accounting/fee-categories-settings/fee-categories-table/fee-categories-table';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { classname } from '@utils/classname';

import './fee-categories-settings-page.scss';

const cn = classname('fee-categories-settings');

const FeeCategoriesSettingsPage = () => (
    <div className={cn()}>
        <FeeCategoriesTable />
        <CreateEditFeeCategoryBlock />
        <DeleteFeeCategoryPopup />
    </div>
);

FeeCategoriesSettingsPage.getLayout = getMainLayout({
    head: <FeeCategoriesSettingsPageHead />,
    permissions: [{ scope: 'adminPanelAccounting', functionality: 'admin_panel.fees.view_any' }],
});

export default FeeCategoriesSettingsPage;
