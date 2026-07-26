import React from 'react';

import { InitiateAccountPaymentMethodsPopup, SupportChatDrawer } from '@/components/common';
import { classname } from '@utils';

import { ReportPopup } from '../../owners-and-drivers';

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
