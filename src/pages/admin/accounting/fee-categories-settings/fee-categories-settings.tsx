import React from 'react';

import { CreateEditFeeCategoryBlock, DeleteFeeCategoryPopup, FeeCategoriesSettingsPageHead, FeeCategoriesTable, getMainLayout } from '@components';
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
