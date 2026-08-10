import React from 'react';
import Head from 'next/head';

import { PageHeader } from '@/components/common/page-header/page-header';
import { useCompanyPage } from '@/hooks/companies/use-company-page';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('client:company-page:head');

export const CompanyPageHead = () => {
    const { company } = useCompanyPage();

    return (
        <PageHeader>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            {company?.name ?? t('header')}
        </PageHeader>
    );
};
