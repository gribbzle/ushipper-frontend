import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RequestStatus } from '@utils';

import { INotification, NotificationsSliceState } from './types';

const initialState: NotificationsSliceState = {
    isDrawerOpen: false,

    notifications: null,
    getNotificationsRequest: {
        status: RequestStatus.NONE,
        nextCursor: null,
    },

    changeNotificationStatusRequest: {
        status: RequestStatus.NONE,
    },
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isDrawerOpen = action.payload;
        },
        setGetNotificationsRequestStatus: (state, action: PayloadAction<RequestStatus>) => {
            state.getNotificationsRequest.status = action.payload;
        },
        setNotificationsNextCursor: (state, action: PayloadAction<string | null>) => {
            state.getNotificationsRequest.nextCursor = action.payload;
        },
        resetNotification: state => {
            state.notifications = null;
        },
        appendNotifications: (state, action: PayloadAction<{ notifications: INotification[]; insertToStart?: boolean }>) => {
            if (!state.notifications) {
                state.notifications = [];
            }
            const { notifications, insertToStart } = action.payload;

            if (insertToStart) {
                state.notifications = [...notifications, ...state.notifications];
            } else {
                state.notifications.push(...notifications);
            }
        },
        setChangeNotificationStatusRequestStatus: (state, action: PayloadAction<RequestStatus>) => {
            state.getNotificationsRequest.status = action.payload;
        },
        updateNotification: (state, action: PayloadAction<INotification>) => {
            const notification = state.notifications?.find(({ id }) => id === action.payload.id);

            if (notification) {
                Object.assign(notification, action.payload);
            }
        },
        removeNotificationById: (state, action: PayloadAction<string>) => {
            if (!state.notifications) {
                return state;
            }
            state.notifications = state.notifications.filter(({ id }) => id !== action.payload);
        },
    },
});

export const notificationsActions = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
