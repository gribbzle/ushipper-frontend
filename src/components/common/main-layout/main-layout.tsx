import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { BetweenPhonesChatDrawer } from '@/components/common/between-phones-chat-drawer/between-phones-chat-drawer';
import { ChatsDrawer } from '@/components/common/chats-drawer/chats-drawer';
import { ErrorBoundary } from '@/components/common/error-boundary/error-boundary';
import { ImageViewerPopup } from '@/components/common/viewers/image-viewer-popup/image-viewer-popup';
import { PDFViewerPopup } from '@/components/common/viewers/pdf-viewer-popup/pdf-viewer-popup';
import { WebsocketWatcher } from '@/components/common/websocket-watcher/websocket-watcher';
import { Permission, useCheckPermission } from '@/hooks/use-check-permission';
import { useMeDispatcher } from '@/hooks/use-user-role-group';
import { useAppSelector } from '@store';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils/classname';

import { DeleteChatMessagePopup } from '../messages/delete-chat-message-popup';
import { UpdateChatMessagePopup } from '../messages/update-chat-message-popup';
import { NotificationsDrawer } from '../notifications-drawer';

import { AccessForbiddenBlock } from './access-forbidden-block';
import { HeaderUserBlock } from './header-user-block';
import { Sidebar } from './sidebar';

import './main-layout.scss';

type MainLayoutConfiguration = {
    head?: React.ReactNode;
    permissions?: Permission[];
    className?: string;
};

type Props = MainLayoutConfiguration & {
    children: React.ReactNode;
};

const cn = classname('main-layout');

const MainLayout = (props: Props) => {
    const { children, head, permissions, className } = props;
    const authorizedUser = useAppSelector(authorizedUserSelector);
    const router = useRouter();
    const checkPermission = useCheckPermission();
    const isPageAccessAllowed = checkPermission(permissions);
    const isDispatcherPage = useMeDispatcher();

    useEffect(() => {
        if (!isPageAccessAllowed && isDispatcherPage) {
            router.push('dashboard');
        }
    }, [router, isDispatcherPage, isPageAccessAllowed]);

    return (
        <div className={cn('', className)}>
            <div className={cn('sidebar', 'no-print')}>
                <Sidebar />
            </div>
            <div className={cn('content')}>
                <div className={cn('head')}>
                    {isPageAccessAllowed ? head : 'Error 403'}
                    <HeaderUserBlock />
                </div>
                <div className={cn('body')}>{isPageAccessAllowed ? children : <AccessForbiddenBlock />}</div>
            </div>
            {authorizedUser && (
                <>
                    <WebsocketWatcher />
                    <ChatsDrawer />
                    <DeleteChatMessagePopup />
                    <UpdateChatMessagePopup />
                    <BetweenPhonesChatDrawer />
                    <PDFViewerPopup />
                    <ImageViewerPopup />
                    <ErrorBoundary details={{ context: 'NotificationsDrawer' }}>
                        <NotificationsDrawer />
                    </ErrorBoundary>
                </>
            )}
        </div>
    );
};

// eslint-disable-next-line react/display-name
export const getMainLayout = (config: MainLayoutConfiguration) => (page: React.ReactNode) => <MainLayout {...config}>{page}</MainLayout>;
