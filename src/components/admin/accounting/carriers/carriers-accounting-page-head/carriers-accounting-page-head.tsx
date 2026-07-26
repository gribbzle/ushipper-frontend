import React from 'react';
import Head from 'next/head';

import { Button, PageHeader } from '@components';
import { useCompaniesActionsPermission, useOpenCreateCompanyDrawer } from '@hooks';
import { PlusCircleIcon } from '@icons';
import { getProjectName, translateByNamespace } from '@utils';

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
