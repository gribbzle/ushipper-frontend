import { INotification, NotificationStatus } from '@store/common/notifications/types';
import { axios, CursorPagination } from '@utils';

export const fetchNotifications = async (userId: string, status: NotificationStatus, cursor: string | null) => {
    const result = await axios.get(`/api/users/${userId}/notifications`, {
        params: { status: status ? status : null, cursor, orderName: 'created_at', orderDirection: 'desc' },
    });

    return result.data.data as CursorPagination<INotification[]>;
};

export const updateNotificationStatus = async (userId: string, notificationId: string, status: NotificationStatus) => {
    const result = await axios.patch(`/api/users/${userId}/notifications/${notificationId}`, { status });

    return result.data.data as INotification;
};

export const deleteNotification = async (userId: string, notificationId: string) => {
    await axios.delete(`/api/users/${userId}/notifications/${notificationId}`);
};
