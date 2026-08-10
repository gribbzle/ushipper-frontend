import React from 'react';

import { SupportChatDrawer } from '@/components/common/chats/support-chat-drawer/support-chat-drawer';
import { classname } from '@utils/classname';

import './fuel-page-layout.scss';

const cn = classname('fuel-page-layout');

export const FuelPageLayout = ({ children }: { children: React.ReactNode }) => (
    <>
        <div className={cn()}>{children}</div>
        <SupportChatDrawer />
    </>
);
