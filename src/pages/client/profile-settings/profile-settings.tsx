import React, { useCallback } from 'react';
import Head from 'next/head';

import { BusinessInfo } from '@/components/client/profile-settings/business-info/business-info-form';
import { Button } from '@/components/common/button/button';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { PersonalInfoForm } from '@/components/client/profile-settings/personal-info/personal-info-form';
import { useAppSelector } from '@store';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './profile-settings.scss';
import ExternalLinkIcon from '@/assets/icons/external-link.svg';

const t = translateByNamespace('client:profile-settings');
const cn = classname('profile-settings');

// TODO: move to separate and reusable component. Same as in company settings header
const ProfileSettingsPageHeader = () => {
    const user = useAppSelector(authorizedUserSelector);
    const openCompanyPreview = useCallback(async () => {
        if (user?.companyPublicId) {
            window.open(`/companies/${user.companyPublicId}`);
        }
    }, [user]);

    return (
        <div>
            {t('header')}{' '}
            <Button size='medium' onClick={openCompanyPreview}>
                <ExternalLinkIcon /> {t('view-profile')}
            </Button>
        </div>
    );
};

const ProfileSettingsPage = () => {
    return (
        <>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <div className={cn('cards')}>
                <PersonalInfoForm />
                <BusinessInfo />
            </div>
        </>
    );
};

ProfileSettingsPage.getLayout = getMainLayout({
    head: <ProfileSettingsPageHeader />,
});

export default ProfileSettingsPage;
