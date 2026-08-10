import React from 'react';
import Head from 'next/head';

import { BetweenPhonesChatDrawer } from '@/components/common/between-phones-chat-drawer/between-phones-chat-drawer';
import { DriversList } from '@/components/client/drivers-plan/drivers-list/drivers-list';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { LoadboardNoticePopup } from '@/components/client/loadboard/loadboard-notice-popup/loadboard-notice-popup';
import { OrderChatDrawer } from '@/components/client/orders/drawers/order-chat-drawer/order-chat-drawer';
import { ParsedOrderDetailsDrawer } from '@/components/client/loadboard/parsed-order-details-drawer/parsed-order-details-drawer';
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
