import React from 'react';
import Head from 'next/head';

import { BetweenPhonesChatDrawer, DriversList, getMainLayout, LoadboardNoticePopup, OrderChatDrawer, ParsedOrderDetailsDrawer } from '@components';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './drivers-plan.scss';

const t = translateByNamespace('client:drivers-plan');
const cn = classname('drivers-plan');

const DriversPlanPage = () => (
    <div className={cn()}>
        <Head>
            <title>{t('page-title', { projectName: getProjectName() })}</title>
        </Head>
        <DriversList />
        <ParsedOrderDetailsDrawer />
        <LoadboardNoticePopup />
        <OrderChatDrawer />
        <BetweenPhonesChatDrawer />
    </div>
);

const PageHead = () => <div className={cn('header')}>{t('header')}</div>;

DriversPlanPage.getLayout = getMainLayout({ head: <PageHead /> });

export default DriversPlanPage;
