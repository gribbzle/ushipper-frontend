import { SavedLoadboardSearch } from '@/api/loadboard';
import { LoadBoardFilters, SavedLoadBoardFilters } from '@store/api/loadboard-api';
import { OrderVehicle } from '@/shared/types';
import { Load, OrderDeliveryInformation, OrderPaymentInformation, OrderPickupInformation } from '@store/common/orders/types';
import { Avatar } from '@store/common/staff/avatar-types';
import { Call } from '@twilio/voice-sdk';

export type RequestDrawer = {
    opened: boolean;
    order?: Load;
    title: string | null;
    reverse?: boolean;
};

export type LoadboardList = {
    filters: SavedLoadBoardFilters;
    isSearchAlongRoute: boolean;
};

export type SavedSearches = {
    searches: SavedLoadboardSearch[];
};

export type SaveSearchDrawer = {
    opened: boolean;
};

export type ParsedOrderData = {
    id: string;
    pickupInformation: Pick<OrderPickupInformation, 'streetAddress' | 'city' | 'state' | 'zip'>;
    deliveryInformation: Pick<OrderDeliveryInformation, 'streetAddress' | 'city' | 'state' | 'zip' | 'scheduledDeliveryAt'>;
    orderId: string;
    paymentPrice: number;
    modifiedAt: string;
    companyName: string;
    vehicles: string[];
    contractSignedAt?: string;
    contractSignedOrderPublicId?: string;
    contractSignedBy?: {
        name: string;
        nickname?: string | null;
        avatar: Avatar;
        roleName: string;
    };
};

export type ParsedOfferData = {
    guid: string;
    pickupInformation: Pick<OrderPickupInformation, 'streetAddress' | 'city' | 'state' | 'zip' | 'scheduledPickupAt'>;
    deliveryInformation: Pick<OrderDeliveryInformation, 'streetAddress' | 'city' | 'state' | 'zip' | 'scheduledDeliveryAt'>;
    paymentInformation: Pick<OrderPaymentInformation, 'payment' | 'terms' | 'method' | 'notes' | 'delayedPayment' | 'delayedTerms' | 'delayedMethod'>;
    vehicles: OrderVehicle[];
    orderId: string;
    companyName: string;
};

export type CheckingContractPopup = {
    title: string | null;
    opened: boolean;
    publicOrderId?: string | null;
    orderId: string | null;
    parsedOrders?: ParsedOrderData[] | null;
    isChecking: boolean;
    message: string | null;
    assignedDriverId: string | null;
    isSuccess: boolean;
    note: string | null;
    externalAssignedDriverId: string | null;
};

export type LoadboardNoticePopup = {
    opened: boolean;
    description: string | null;
};

export type CallingPopupState = {
    isOpened: boolean;
    name: string | null;
    phoneNumber: string | null;
    call: Call | null;
    orderPublicId: string | null;
    loadBoardFilters: LoadBoardFilters | null;
};

export type BetweenPhonesChatDrawerState = {
    isVisible: boolean;
    externalNumber: string | null;
};

export type LoadboardSliceState = {
    requestDrawer: RequestDrawer;
    saveSearchDrawer: SaveSearchDrawer;
    list: LoadboardList;
    savedSearches: SavedSearches;
    checkingContractPopup: CheckingContractPopup;
    loadboardNoticePopup: LoadboardNoticePopup;
    callingPopupState: CallingPopupState;
    isRegisterTwilioSuccess: boolean;
    isCheckingContractLoading: boolean;
    betweenPhonesChatDrawerState: BetweenPhonesChatDrawerState;
};

export type CreateSearchPayload = {
    name: string;
    filters: SavedLoadBoardFilters;
};

export type UpdateSearchPayload = {
    id: string;
    name: string;
    filters: SavedLoadBoardFilters;
};

export type RemoveSearchPayload = {
    id: string;
};
