import React from 'react';
import Head from 'next/head';

import { PageHeader } from '@/components/common/page-header/page-header';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('admin:fuel:transactions-page');

export const FuelTransactionsPageHead = () => {
    return (
        <>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>{t('header')}</PageHeader>
        </>
    );
};
