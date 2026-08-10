import React from 'react';
import Head from 'next/head';

import { Button } from '@/components/common/button/button';
import { CompaniesFilters as CompaniesFiltersComponent } from '@/components/admin/companies/companies-filters/companies-filters';
import { CompaniesTable } from '@/components/admin/companies/companies-table/companies-table';
import { CreateEditCompanyDrawer } from '@/components/admin/companies/create-edit-company-drawer/create-edit-company-drawer';
import { DeleteCompanyPopup } from '@/components/admin/companies/delete-company-popup/delete-company-popup';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useCompaniesActionsPermission } from '@/hooks/companies/use-companies-actions-permission';
import { useOpenCreateCompanyDrawer } from '@/hooks/companies/use-open-create-company-drawer';
import { PlusCircleIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './companies.scss';

const t = translateByNamespace('admin:companies-page');
const cn = classname('companies-page');

const CompaniesPage = () => (
    <div className={cn()}>
        <Head>
            <title>{t('page-title', { projectName: getProjectName() })}</title>
        </Head>
        <CompaniesFiltersComponent />
        <CompaniesTable />
        <CreateEditCompanyDrawer />
        <DeleteCompanyPopup />
    </div>
);

const PageHead = () => {
    const { onOpenCreateCompanyDrawer } = useOpenCreateCompanyDrawer();

    const hasPermission = useCompaniesActionsPermission();

    return (
        <div className={cn('head')}>
            {t('header')}
            {hasPermission && (
                <Button view='primary' size='medium' onClick={onOpenCreateCompanyDrawer}>
                    <PlusCircleIcon /> {t('add-company-button-title')}
                </Button>
            )}
        </div>
    );
};

CompaniesPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.companies.view_any' }],
});

export default CompaniesPage;
