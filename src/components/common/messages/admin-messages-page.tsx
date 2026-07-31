import React from 'react';
import Head from 'next/head';

import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import { getMainLayout } from '../main-layout';

import { DriverChatSelectorPopup } from './driver-chat-selector-popup';
import { MessagesPageHead } from './messages-page-head';
import { MessagesPageLayout } from './messages-page-layout';

const t = translateByNamespace('common:messages-page');

const AdminMessagesPage = () => (
    <>
        <Head>
            <title>{t('head-title', { projectName: getProjectName() })}</title>
        </Head>
        <MessagesPageLayout />
        <DriverChatSelectorPopup />
    </>
);

AdminMessagesPage.getLayout = getMainLayout({
    head: <MessagesPageHead />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.chats.view_any' }],
});

export default AdminMessagesPage;
