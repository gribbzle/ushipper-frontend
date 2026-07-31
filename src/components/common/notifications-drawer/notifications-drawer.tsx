import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { debounce } from 'debounce';
import { useSelector } from 'react-redux';

import { ErrorBoundary } from '@/components/common/error-boundary/error-boundary';
import { useAppDispatch, useAppSelector } from '@store';
import {
    getNotificationsAction,
    getNotificationsRequestSelector,
    INotification,
    isNotificationsDrawerOpenSelector,
    notificationsActions,
    notificationsSelector,
    NotificationsSliceState,
    NotificationStatus,
} from '@store/common/notifications';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';

import { Drawer } from '../drawer';
import { TabItemBase, Tabs } from '../tabs';

import { Notification } from './notification';

import './notifications-drawer.scss';

const t = translateByNamespace('common:notifications');
const tTab = (tab: string) => t(`tabs.${tab}`);

const cn = classname('notifications-drawer');

const TABS = [
    { label: tTab('all'), value: '' },
    { label: tTab('unread'), value: 'unread' },
    { label: tTab('read'), value: 'read' },
    { label: tTab('pinned'), value: 'pinned' },
] as { label: string; value: NotificationStatus }[];

const formatDate = (date: string) => format(new Date(date), 'MMMM d');

export const NotificationsDrawer = () => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(isNotificationsDrawerOpenSelector);
    const user = useAppSelector(authorizedUserSelector);
    const [currentTab, setCurrentTab] = useState<NotificationStatus>('');

    const onCloseHandler = useCallback(() => {
        dispatch(notificationsActions.setIsDrawerOpen(false));
    }, [dispatch]);

    const onSelectTabHandler = useCallback((event: TabItemBase) => {
        setCurrentTab(event.value as NotificationStatus);
    }, []);

    const getNotificationsDebounced = useMemo(
        () =>
            debounce((status: NotificationStatus) => {
                dispatch(getNotificationsAction({ status }));
            }, 300),
        [dispatch],
    );

    useEffect(() => {
        dispatch(notificationsActions.setNotificationsNextCursor(null));
        getNotificationsDebounced(currentTab);
    }, [currentTab, dispatch, getNotificationsDebounced]);

    const notifications = useAppSelector(notificationsSelector);

    const notificationsContainerRef = useRef<HTMLDivElement | null>(null);
    const getNotificationsRequest = useSelector(getNotificationsRequestSelector);
    const getNotificationsRequestRef = useRef<NotificationsSliceState['getNotificationsRequest']>();
    const currentTabRef = useRef<NotificationStatus>('');

    useEffect(() => {
        getNotificationsRequestRef.current = getNotificationsRequest;
        currentTabRef.current = currentTab;
    }, [currentTab, getNotificationsRequest]);

    const onScrollHandler = useCallback(
        (event: Event) => {
            const target = event.target as HTMLDivElement;

            if (!(target instanceof HTMLDivElement)) {
                return;
            }

            const getChatsRequest = getNotificationsRequestRef.current;

            const isListScrolledToBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 300;
            const isNextRequestAvailable = getChatsRequest?.status === RequestStatus.NONE || getChatsRequest?.nextCursor;

            if (isListScrolledToBottom && isNextRequestAvailable) {
                getNotificationsDebounced(currentTabRef.current);
            }
        },
        [getNotificationsDebounced],
    );

    useEffect(() => {
        const notificationsContainer = notificationsContainerRef.current;

        if (!notificationsContainer || !isOpen) {
            return;
        }

        notificationsContainer.addEventListener('scroll', onScrollHandler);

        return () => notificationsContainer.removeEventListener('scroll', onScrollHandler);
    }, [dispatch, getNotificationsDebounced, isOpen, onScrollHandler]);

    const notificationsBlocks = useMemo(() => {
        if (!notifications) {
            return {};
        }

        const result = {} as { [key: string]: INotification[] };

        notifications.forEach(notification => {
            const date = formatDate(notification.createdAt);

            if (!result[date]) {
                result[date] = [];
            }

            result[date].push(notification);
        });

        return result;
    }, [notifications]);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onCloseHandler}
            head={t('drawer-header')}
            className={cn()}
            actions={null}
            body={
                <>
                    <Tabs tabs={TABS} onSelectTab={onSelectTabHandler} />
                    <div className={cn('list')} ref={notificationsContainerRef}>
                        {Object.entries(notificationsBlocks).map(([date, notifications]) => (
                            <Fragment key={date}>
                                <div className={cn('delimiter-date')}>{date}</div>
                                {notifications.map(notification => (
                                    <ErrorBoundary key={notification.id} details={{ notification, user, context: 'NotificationItem' }}>
                                        <Notification {...notification} activeTab={currentTab} />
                                    </ErrorBoundary>
                                ))}
                            </Fragment>
                        ))}
                        {getNotificationsRequest.status === RequestStatus.SUCCESS && Object.keys(notificationsBlocks).length === 0 && (
                            <div className={cn('no-notifications-placeholder')}>{t(`no-notifications-placeholder.${currentTab || 'all'}`)}</div>
                        )}
                    </div>
                </>
            }
        />
    );
};
