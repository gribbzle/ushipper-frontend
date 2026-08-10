import React from 'react';
import Head from 'next/head';

import { FuelCardsPreferences } from '@/components/admin/settings/preferences/fuel-cards/fuel-cards';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { RegistrationPreferences } from '@/components/admin/settings/preferences/registration/registration';
import { TransactionPreferences } from '@/components/admin/settings/preferences/transaction/transaction';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './preferences.scss';

const t = translateByNamespace('admin:preferences-page');
const cn = classname('preferences-page');

const PreferencesPage = () => (
    <>
        <Head>
            <title>{t('head-title', { projectName: getProjectName() })}</title>
        </Head>
        <div className={cn()}>
            <RegistrationPreferences />
            <FuelCardsPreferences />
            <TransactionPreferences />
        </div>
    </>
);

const PageHead = () => <div className={cn('head')}>{t('title')}</div>;

PreferencesPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [{ scope: 'adminPanelSettings', functionality: 'admin_panel.settings.preferences.view_any' }],
});

export default PreferencesPage;
