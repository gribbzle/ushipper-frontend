import React from 'react';
import Head from 'next/head';

import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import { getMainLayout } from '../main-layout';

import { MessagesPageHead } from './messages-page-head';
import { MessagesPageLayout } from './messages-page-layout';

const t = translateByNamespace('common:messages-page');

const MessagesPage = () => {
    return (
        <>
            <Head>
                <title>{t('head-title', { projectName: getProjectName() })}</title>
            </Head>
            <MessagesPageLayout />
        </>
    );
};

MessagesPage.getLayout = getMainLayout({
    head: <MessagesPageHead />,
});

export default MessagesPage;
