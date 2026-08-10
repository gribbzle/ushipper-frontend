import React from 'react';
import Head from 'next/head';

import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { useCompaniesActionsPermission } from '@/hooks/companies/use-companies-actions-permission';
import { useOpenCreateCompanyDrawer } from '@/hooks/companies/use-open-create-company-drawer';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import PlusCircleIcon from '@/assets/icons/plus-circle-icon.svg';

const t = translateByNamespace('admin:accounting');
const tBtn = translateByNamespace('admin:companies-page');

export const CarriersAccountingPageHead = () => {
    const { onOpenCreateCompanyDrawer } = useOpenCreateCompanyDrawer();
    const hasCompaniesActionsPermission = useCompaniesActionsPermission();

    return (
        <>
            <Head>
                <title>{t('carriers:title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>
                {t('carriers:header')}
                {hasCompaniesActionsPermission && (
                    <Button view='primary' size='medium' onClick={onOpenCreateCompanyDrawer}>
                        <PlusCircleIcon /> {tBtn('add-company-button-title')}
                    </Button>
                )}
            </PageHeader>
        </>
    );
};
