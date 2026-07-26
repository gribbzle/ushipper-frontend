import React from 'react';
import Head from 'next/head';

import { PageHeader } from '@components';
import { getProjectName, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:cod-orders');

export const CODOrdersPageHead = () => (
    <>
        <Head>
            <title>{t('title', { projectName: getProjectName() })}</title>
        </Head>
        <PageHeader>{t('header')}</PageHeader>
    </>
);
