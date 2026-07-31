type AppState = {
    common: {
        notifications: any;
    };
};

export const notificationsStateSelector = (state: AppState) => state.common.notifications;

export const isNotificationsDrawerOpenSelector = (state: AppState) => {
    const { isDrawerOpen } = notificationsStateSelector(state);

    return isDrawerOpen;
};

export const notificationsNextCursorSelector = (state: AppState) => {
    const { getNotificationsRequest } = notificationsStateSelector(state);

    return getNotificationsRequest.nextCursor;
};

export const notificationsSelector = (state: AppState) => {
    const { notifications } = notificationsStateSelector(state);

    return notifications;
};

export const getNotificationsRequestSelector = (state: AppState) => {
    const { getNotificationsRequest } = notificationsStateSelector(state);

    return getNotificationsRequest;
};
