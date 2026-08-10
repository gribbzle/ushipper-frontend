import React from 'react';

import { InitiateAccountPaymentMethodsPopup } from '@/components/common/initiate-account-payment-methods-popup/initiate-account-payment-methods-popup';
import { SupportChatDrawer } from '@/components/common/chats/support-chat-drawer/support-chat-drawer';
import { classname } from '@utils/classname';

import { ReportPopup } from '../../owners-and-drivers/report-popup';

import './accounting-page-layout.scss';

const cn = classname('accounting-page-layout');

export const AccountingPageLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        <div className={cn()}>{children}</div>
        <SupportChatDrawer />
        <ReportPopup />
        <InitiateAccountPaymentMethodsPopup />
    </>
);
