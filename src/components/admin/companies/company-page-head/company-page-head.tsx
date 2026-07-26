import React from 'react';
import Head from 'next/head';

import { PageHeader } from '@/components';
import { useCompanyPage } from '@hooks';
import { getProjectName, translateByNamespace } from '@utils';

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
