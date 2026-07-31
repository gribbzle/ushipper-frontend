import { createAsyncThunk } from '@reduxjs/toolkit';

import { deleteNotification, fetchNotifications, updateNotificationStatus } from '@api/notifications';
import { authorizedUserSelector } from '@store/global/selectors';
import { RequestStatus } from '@utils/redux';

import { notificationsNextCursorSelector } from './selectors';
import { notificationsActions } from './slice';
import { INotification, NotificationStatus } from './types';

export const getNotificationsAction = createAsyncThunk<any, { status: NotificationStatus }>(
    'notifications/getNotifications',
    async ({ status }, { rejectWithValue, dispatch, getState }) => {
        const setRequestStatus = notificationsActions.setGetNotificationsRequestStatus;

        try {
            dispatch(setRequestStatus(RequestStatus.PROCESSING));
            const state = getState() as any;
            const authorizedUser = authorizedUserSelector(state);
            const nextCursor = notificationsNextCursorSelector(state);

            if (nextCursor === null) {
                dispatch(notificationsActions.resetNotification());
            }

            const result = await fetchNotifications(authorizedUser?.publicId as string, status, notificationsNextCursorSelector(state));

            dispatch(notificationsActions.appendNotifications({ notifications: result.data }));
            dispatch(notificationsActions.setNotificationsNextCursor(result.meta.nextCursor));
            dispatch(setRequestStatus(RequestStatus.SUCCESS));

            return result;
        } catch (error) {
            dispatch(setRequestStatus(RequestStatus.ERROR));

            return rejectWithValue(error);
        }
    },
);

export const changeNotificationStatusAction = createAsyncThunk<INotification, { notificationPublicId: string; status: NotificationStatus }>(
    'notifications/getNotifications',
    async ({ notificationPublicId, status }, { rejectWithValue, dispatch, getState }) => {
        const setRequestStatus = notificationsActions.setChangeNotificationStatusRequestStatus;

        try {
            dispatch(setRequestStatus(RequestStatus.PROCESSING));
            const state = getState() as any;
            const authorizedUser = authorizedUserSelector(state);
            const result = await updateNotificationStatus(authorizedUser?.publicId as string, notificationPublicId, status);

            dispatch(notificationsActions.updateNotification(result));
            dispatch(setRequestStatus(RequestStatus.SUCCESS));

            return result;
        } catch (error) {
            dispatch(setRequestStatus(RequestStatus.ERROR));

            return rejectWithValue(error);
        }
    },
);

export const deleteNotificationAction = createAsyncThunk<void, string>(
    'notifications/deleteNotification',
    async (notificationPublicId, { rejectWithValue, dispatch, getState }) => {
        const setRequestStatus = notificationsActions.setChangeNotificationStatusRequestStatus;

        try {
            dispatch(setRequestStatus(RequestStatus.PROCESSING));
            const state = getState() as any;
            const authorizedUser = authorizedUserSelector(state);
            const result = await deleteNotification(authorizedUser?.publicId as string, notificationPublicId);

            dispatch(setRequestStatus(RequestStatus.SUCCESS));

            return result;
        } catch (error) {
            dispatch(setRequestStatus(RequestStatus.ERROR));

            return rejectWithValue(error);
        }
    },
);
