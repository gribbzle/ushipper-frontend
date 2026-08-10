import { OrdersCountEvent } from '@/components/common/websocket-watcher/types';
import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { RequestStatus } from '@utils/redux';

import { Avatar } from '../staff/avatar-types';

export type NotificationStatus = 'read' | 'unread' | 'pinned' | '';

export type NotificationsSliceState = {
    isDrawerOpen: boolean;

    notifications: INotification[] | null;

    getNotificationsRequest: {
        status: RequestStatus;
        nextCursor: string | null;
    };

    changeNotificationStatusRequest: {
        status: RequestStatus;
    };
};

export type OrderNotificationPayload = {
    order: {
        publicId: string;
        orderId: string;
        carrierOrder: {
            publicId: string;
            orderId: string;
        };
    };
};

export type OrderRequestData = {
    publicId: string;
    order: {
        carrierCompany: {
            name: string;
            publicId: string;
        };
        company: {
            name: string;
            publicId: string;
        };
        publicId: string;
        orderId: string;
        source?: OrderSourcesEnum;
    };
    type: 'company_to_company' | 'driver_to_dispatcher';
};

export type OrderOfferData = {
    publicId: string;
    carrierCompany: {
        name: string;
        publicId: string;
    };
    order: {
        company: {
            name: string;
            publicId: string;
        };
        publicId: string;
        orderId: string;
    };
};

export type OfferRequestNotificationPayload = {
    jobOffer: {
        publicId: string;
    };
    orderOffer: OrderOfferData;
    orderRequest: OrderRequestData;
};

export type DriverLowBalanceNotificationPayload = {
    minimalLimit: number;
};

export type NotificationType =
    | 'email_only'
    | 'order_picked_up'
    | 'order_restored'
    | 'order_renewed'
    | 'order_put_on_hold'
    | 'order_posted'
    | 'order_pending'
    | 'order_driver_updated'
    | 'order_driver_deleted'
    | 'driver_added_to_order'
    | 'order_accepted'
    | 'order_created'
    | 'order_declined'
    | 'order_deleted'
    | 'order_archived'
    | 'order_unarchived'
    | 'order_delivered'
    | 'order_cancelled'
    | 'order_offer_created'
    | 'user_reset_password'
    | 'user_registered'
    | 'invitation_created'
    | 'company_activated'
    | 'job_offer_created'
    | 'order_request_created'
    | 'order_request_canceled'
    | 'external_imported_order_updated'
    | 'external_signed_contract_updated'
    | 'external_contract_found'
    | 'driver_low_balance';

export type INotification = {
    createdAt: string;
    creator?: {
        name: string;
        avatar: Avatar | null;
    };
    payload: OfferRequestNotificationPayload | OrderNotificationPayload | DriverLowBalanceNotificationPayload;
    metadata: OrdersCountEvent;
    pinnedAt: string | null;
    id: string;
    readAt: string | null;
    type: NotificationType;
    updatedAt: string | null;
};
