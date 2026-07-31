import { INotification, NotificationStatus } from '@store/common/notifications';

export type NotificationProps = INotification & {
    activeTab: NotificationStatus;
};
