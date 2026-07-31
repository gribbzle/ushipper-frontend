import React from 'react';
import Head from 'next/head';

import { PageHeader } from '@/components/common/page-header/page-header';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const t = translateByNamespace('admin:fuel:cards-page');

export const FuelCardsPageHead = () => {
    return (
        <>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <PageHeader>{t('header')}</PageHeader>
        </>
    );
};
