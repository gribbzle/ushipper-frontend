import React from 'react';
import Head from 'next/head';

import CompanyCard from '@/components/client/company-settings/company-card';
import CompanySettingsHeader from '@/components/client/company-settings/company-settings-header';
import ContactCard from '@/components/client/company-settings/contact-card';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useMeCarrier } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import { BusinessInfoCard } from './business-info-card';

import './company-settings.scss';

const t = translateByNamespace('client:company-settings');
const cn = classname('company-settings-page');
const CompanySettingsPageLayout = () => {
    const isMeCarrier = useMeCarrier();

    return (
        <>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <div className={cn('cards')}>
                <CompanyCard />
                <div className={cn('cards-right-column')}>
                    <ContactCard />
                    {isMeCarrier && <BusinessInfoCard />}
                </div>
            </div>
        </>
    );
};

CompanySettingsPageLayout.getLayout = getMainLayout({
    head: <CompanySettingsHeader />,
    permissions: [
        { scope: 'shipperAdministration', functionality: 'shipper.administration.company_settings.view_any' },
        { scope: 'carrierAdministration', functionality: 'carrier.administration.staff.view_any' },
    ],
});

export default CompanySettingsPageLayout;
