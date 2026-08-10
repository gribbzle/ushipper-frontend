import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { PageHeader } from '@/components/common/page-header/page-header';
import { useIsDispatcherOwnerPage, useIsDriverOwnerPage } from '@/hooks/catalogs/use-type-company-owner';
import { useAppSelector } from '@store';
import { fetchedCompanySelector } from '@store/admin';
import { useGetUserQuery } from '@store/api/users-api';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import LinkIcon from '@/assets/icons/link-icon.svg';

const t = translateByNamespace('client:company-page:head');
const translateNotification = translateByNamespace('client:company-page:notification');

const CompanyPageHead = () => {
    const { asPath } = useRouter();
    const company = useAppSelector(fetchedCompanySelector);

    const { data: user } = useGetUserQuery({ id: company?.owner.publicId }, { skip: !company });
    const isDispatcherOwnerPage = useIsDispatcherOwnerPage();
    const isDriverOwnerPage = useIsDriverOwnerPage();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}${asPath}`);
        toast.success(translateNotification<string>('copy-link-success'));
    };

    return (
        <PageHeader>
            <Head>
                <title>
                    {(isDriverOwnerPage || isDispatcherOwnerPage) && user
                        ? `${user.name} | ${getProjectName()}`
                        : t('title', { projectName: getProjectName() })}
                </title>
            </Head>
            {company && (
                <>
                    {isDriverOwnerPage || isDispatcherOwnerPage ? user?.name : company.name}
                    <Button size='medium' onClick={handleCopyLink}>
                        <LinkIcon /> {t('copy-link-btn-label')}
                    </Button>
                </>
            )}
        </PageHeader>
    );
};

export default CompanyPageHead;
