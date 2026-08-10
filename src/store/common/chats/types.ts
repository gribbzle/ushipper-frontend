import { ChatMessageExternalStatusesEnum } from '@/enums/chat-message-external-statuses-enum';
import { ChatMessageTypesEnum } from '@/enums/chat-message-types-enum';
import { ChatTypesEnum } from '@/enums/chat-types-enum';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { OrderStatus } from '@/enums/order-status';
import { PaymentTerm } from '@/enums/payment-term';
import { RequestStatusesEnum } from '@/enums/request-statuses';
import { SystemMessagesTypesEnum } from '@/enums/system-messages-type';
import { Avatar } from '@store/common/staff/avatar-types';
import { RequestStatus } from '@utils/redux';

export type OrderDriverAddedSystemMessagePayload = {
    driver: {
        name: string;
    };
};

export type OrderDriverUpdatedSystemMessagePayload = {
    prevDriver: {
        name: string;
    };
    newDriver: {
        name: string;
    };
};

export type OrderOfferRequest = {
    brokerFee: number | null;
    delayedPayment: number | null;
    paymentPrice: number;
    pickupAt: string | null;
    deliveryAt: string | null;
};

export type OrderOfferRequestSysMessage = {
    orderOffer?: OrderOfferRequest;
    orderRequest?: OrderOfferRequest;
};

export type ChatMessage = {
    content: string;
    createdAt: string;
    editedAt?: string | null;
    creator: {
        avatar: Avatar | null;
        companyName: string;
        companyPublicId: string;
        createdAt: string;
        email: string;
        lastLoginedAt: string;
        name: string;
        nickname?: string;
        phone: string;
        publicId: string;
        roleGroup: string;
        roleId: number;
        roleName: string;
        roleType: string;
        status: string;
        trailerCapacity: number;
        updatedAt: string;
        accountPublicId: string | null;
    } | null;
    readAt: string | null;
    publicId: string;
    systemMessageType: SystemMessagesTypesEnum | null;
    systemMessagePayload?: OrderDriverAddedSystemMessagePayload | OrderDriverUpdatedSystemMessagePayload | OrderOfferRequestSysMessage;
    attachments: ChatMessageAttachment[] | null;
    type: ChatMessageTypesEnum;
    order?: MessageOrder;
    externalStatus?: ChatMessageExternalStatusesEnum;
};

export type ChatMessageAttachment = {
    publicId: string;
    name: string;
    url: string;
    size: number;
    previewImages?: Array<string>;
    metadata?: {
        duration: number;
    };
};

export type MessageDetails = {
    type: 'outgoing_sms' | null;
    phone: string | null;
};

export type MessageOrder = {
    orderId: string | null;
    publicId: string;
};

export type ChatAccountInfo = {
    publicId: string;
    name: string;
    email: string;
    phone: string | null;
    phoneVerifiedAt: string | null;
    emailVerifiedAt: string | null;
    telegramId: string | null;
};

export type ChatUserInfo = {
    name: string;
    avatar: Avatar | null;
    roleName: string;
};

export type ChatShortInfo = {
    lastMessage: ChatMessage | null;
    order?: {
        driverId: string | null;
        publicId: string;
        orderId: string;
        paymentInformation: {
            payment: number;
            terms: PaymentTerm;
        };
        carrierOrder?: any;
        shipperOrder?: any;
        status: OrderStatus;
        type: string;
    };
    orderRequest?: {
        publicId: string;
        status: RequestStatusesEnum;
    };
    orderOffer?: {
        publicId: string;
        status: OfferStatusesEnum;
    };
    publicId: string;
    type: ChatTypesEnum;
    unreadMessageCount: number;
    externalNumber?: string | null;
    internalNumber?: string | null;
    messageOrders?: MessageOrder[];
    account?: ChatAccountInfo | null;
    user?: ChatUserInfo | null;
};

export type ChatFullInfo = {
    chatId: string | null;
    info: ChatShortInfo | null;
    messages: Array<ChatMessage> | null;
    unreadMessages: Array<ChatMessage> | null;

    lastReadMessageId: string | null;

    getChatRequest: {
        status: RequestStatus;
    };

    getChatMessagesRequest: {
        status: RequestStatus;
        nextCursor: string | null;
    };

    getChatUnreadMessagesRequest: {
        status: RequestStatus;
        nextCursor: string | null;
    };

    sendMessageRequest: {
        status: RequestStatus;
    };

    deleteMessageRequest: {
        status: RequestStatus;
    };

    readMessageRequest: {
        status: RequestStatus;
    };
};

export type SupportChatDrawerPropsState = {
    isVisible: boolean;
    accountId: string | null;
    accountName: string | null;
};

export type ChatsDrawerSliceState = {
    isDrawerOpen: boolean;
    needToReset: boolean;
    setSelectedAtTop: boolean;
    drawerChats: Array<ChatShortInfo>;
    drawerSelectedChatId: string | null;
    getChatsRequest: {
        status: RequestStatus;
        nextCursor: string | null;
    };
    getChatIdByOrderIdRequest: {
        status: RequestStatus;
    };
    chats: {
        [key: string]: ChatFullInfo | undefined;
    };
    driverSupportChat: ChatShortInfo | null;
    supportChatDrawerProps: SupportChatDrawerPropsState;
};
