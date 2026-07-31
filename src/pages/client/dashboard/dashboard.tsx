import React from 'react';
import Head from 'next/head';

import { DashboardCurrentLoads, DashboardStatisticsBlock, getMainLayout } from '@components';
import { useMeDispatcher } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './dashboard.scss';

const t = translateByNamespace('client:dashboard-page');
const cn = classname('dashboard-page');

const DashboardPage = () => {
    const isMeDispatcher = useMeDispatcher();

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            {isMeDispatcher && <DashboardCurrentLoads />}
            <DashboardStatisticsBlock type='gross' />
            <DashboardStatisticsBlock type='miles' />
            <DashboardStatisticsBlock type='avg-mile-cost' />
        </div>
    );
};

const PageHead = () => <div className={cn('header')}>{t('header')}</div>;

DashboardPage.getLayout = getMainLayout({ head: <PageHead /> });

export default DashboardPage;
