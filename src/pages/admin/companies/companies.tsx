import React from 'react';
import Head from 'next/head';

import { Button, CompaniesFilters as CompaniesFiltersComponent, CompaniesTable, CreateEditCompanyDrawer, DeleteCompanyPopup, getMainLayout } from '@components';
import { useCompaniesActionsPermission, useOpenCreateCompanyDrawer } from '@hooks';
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
