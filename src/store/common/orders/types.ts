import { UserOrderStatus } from '@/enums/user-order-status-enum';
import { Attachment, Creator, NullableFields } from '@/shared';
import { OrderVehicle } from '@/shared';
import { DateTypes } from '@/enums/date-types-enum';
import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { InspectionType } from '@/enums/inspection-type';
import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { OrderPaymentStatus } from '@/enums/order-payment-status';
import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { OrderStatus } from '@/enums/order-status';
import { OrderType } from '@/enums/order/order-type';
import { PaymentMethod } from '@/enums/payment-method';
import { PaymentTerm } from '@/enums/payment-term';
import { TransportTypeEnum } from '@/enums/transport-type-enum';
import { BalanceValue } from '@store/admin/accounting/balance-types';
import { Company } from '@store/admin/companies/types';
import { OrderCommodity } from '@store/api/order-commodity-types';
import { OrderExpense } from '@store/api/order-expenses-api';
import { OrderInternalNote } from '@store/api/order-internal-notes-api';
import { OrderRequest } from '@store/api/order-requests-types';
import { User } from '@store/common/staff/types';
import { Fee } from '@types';

import { Review } from '../../client/review/types';

import { UserCompany } from './user-company-types';

export type OrderOffer = {
    acceptedAt?: string;
    declineComment?: string | null;
    declineReasons?: string[];
    pickupDateType: DateTypes;
    declinedAt?: string;
    deliveryDateType: DateTypes;
    orderRequest: OrderRequest | null;
    creator: Creator;
    deliveryAt: string;
    createdAt: string;
    order: Load;
    paymentTerms: PaymentTerm;
    delayedTerms: PaymentTerm | null;
    paymentPrice: number;
    delayedPayment: number | null;
    brokerFee: number | null;
    pickupAt: string;
    publicId: string;
    status: OfferStatusesEnum;
    carrierCompany: Company;
    shipperCompany: Company;
};

export type ExternalCompanyContact = NullableFields<{
    contact: string;
    preferredContactMethod: string;
    mainPhone: string;
    localPhone: string;
    tollFree: string;
    faxNumber: string;
}>;

export type ExternalCompanyDetails = NullableFields<{
    address: string;
    ownerManager: string;
    businessType: string;
    webSite: string;
    hours: string;
    establishedIn: string;
    companyDescription: string;
}>;

export type ExternalCompany = {
    name: string;
    phone: string | null;
    email: string;
    workingHours: string | null;
    oldRating: number;
    oldCountRating: number;
    rating: number;
    countRating: number;
    mcNumber: string | null;
    type: string | null;
    contactInformation: ExternalCompanyContact | null;
    companyInformation: ExternalCompanyDetails | null;
};

export type OrderDetails = NullableFields<{
    orderId: string;
    inspectionType: InspectionType;
    internalOrderId?: string;
    driverInstructions?: string;
    instructions?: string;
    trailerType?: TransportTypeEnum;
}>;

export type OrderSignatureOwner = NullableFields<{
    name: string;
    nickname?: string;
    avatar: string;
    roleName: string;
}>;

export type OrderSignature = NullableFields<{
    signature: {
        publicId: string;
        owner: OrderSignatureOwner | null;
        type: 'touchless' | 'manual' | 'customer_not_available' | null;
        phone: string | null;
        status: 'not_sent' | 'sent' | 'confirmed ' | null;
        fullName: string | null;
        attachment: NullableFields<Attachment>;
        createdAt: string;
        updatedAt: string;
    };
    signedAt: string;
}>;

export type OrderPickupInformation = NullableFields<{
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    scheduledPickupAt: string;
    buyerNumber: string;
    notes: string;
    fullName: string;
    phone: string;
    email: string;
    geoLatitude: number;
    geoLongitude: number;
    timezone: string;
    driverSignature?: OrderSignature;
    customerSignature?: OrderSignature;
    pickupDateType?: DateTypes;
}>;

export type OrderPickupInformationDrawerState = {
    isVisible: boolean;
};

export type OrderDeliveryInformation = NullableFields<{
    businessName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    scheduledDeliveryAt: string;
    notes: string;
    fullName: string;
    phone: string;
    email: string;
    saveAsNewContact: boolean; // TODO: убрать
    geoLatitude: number;
    geoLongitude: number;
    timezone: string;
    deliveryDateType?: DateTypes;
    driverSignature?: OrderSignature;
    customerSignature?: OrderSignature;
}>;

export type OrderDeliveryInformationDrawerState = {
    isVisible: boolean;
};

export type OrderCustomerInformation = NullableFields<{
    customerName: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    fullName: string;
    phone: string;
    email: string;
    mcNumber: string;
    externalCompany?: ExternalCompany;
    businessType?: string;
}>;

export type OrderCustomerInformationDrawerState = OrderCustomerInformation & {
    isVisible: boolean;
};

export type OrderInformation = OrderCustomerInformation | OrderDeliveryInformation | OrderPickupInformation;

export type OrderPaymentInformation = NullableFields<{
    terms: PaymentTerm;
    method: PaymentMethod;
    payment: number;
    notes: string;
    invoiceId: string;
    invoiceNotes: string;
    clientPrice?: number;
    clientTerms?: PaymentTerm;
    driverPay?: number;
    delayedPayment: number;
    delayedTerms: PaymentTerm;
    delayedMethod: PaymentMethod;
    brokerFee: number;
}>;

export type OrderSendBOLFormState = {
    email: string;
};

export type OrderSendBOLDrawerState = {
    isVisible: boolean;
    orderId: string | null;
};

export type OrderPaymentInformationDrawerState = OrderPaymentInformation & {
    isVisible: boolean;
};

export type OrderSetDriverDrawerState = {
    isVisible: boolean;
    orderId: string | null;
    selectedUserId?: string | null;
};

export type OrderSetDispatcherDrawerState = {
    orderId: string | null;
    selectedUserId?: string | null;
    isVisible: boolean;
};

export type OrderDriverInstructionsDrawerState = {
    isVisible: boolean;
};

export type OrderMarkAsPaidDrawerState = {
    orderId: string | null;
    isVisible: boolean;
};

export type OrderSendInvoiceDrawerState = {
    isVisible: boolean;
    customerName: string | null;
    publicOrderId: string | null;
};

export type OrderDetailsDrawerState = {
    isVisible: boolean;
};

export type OrderActivityDetailsDrawerState = {
    isVisible: boolean;
    details: object | null;
    creatorName: string | null;
    createdAt: string | null;
};

export type InstantTermPaymentMethod = PaymentMethod | 'ach' | 'uship' | null;

export type OrderDriverPaymentFormDrawerDrawerState = {
    isVisible: boolean;
    orderId: string | null;
    attachment: Attachment | null;
    instantTermPaymentType: InstantTermPaymentType | null;
    instantTermPaymentMethod?: InstantTermPaymentMethod | null;
};

export type OrderDriverPaymentFormState = {
    instantTermPaymentType?: InstantTermPaymentType | null;
    instantTermPaymentMethod?: InstantTermPaymentMethod;
    receipts?: Array<File>;
};

export type OrderPayment = {
    payer: string;
    receiver: string;
    paidAmount: number;
    paidMethod: PaymentMethod;
    referenceNumber: string;
    receiptAt: string;
    paymentTerms: string;
};

export type { UserCompany, UserCompanyOwner } from './user-company-types';

export type ShipperOrder = {
    publicId: string;
    company: UserCompany;
    review: Review | null;
    status: OrderStatus;
};

export type CarrierOrder = ShipperOrder & {
    vehicles: OrderVehicle[];
    commodities: OrderCommodity[];

    //TODO update after backend is ready
    // driver?: TrackingDriver | null;
};

export type ExternalCDShipper = Partial<{
    customerId: string;
    userName: string;
    tierGroup: string;
    companyName: string;
    phone: string;
    email: string;
    hoursOfOperation: string;
    isActive: true;
    hqTimeZone: string;
    rating: number;
    numberOfRatings: number;
    overallRating: {
        averageRating: number;
        totalAmount: number;
    };
}>;

export type ExternalSDShipper = Partial<{
    name: string;
    contactPhone: string;
    contactEmail: string;
    ratingDetails: {
        totalRatingCount: 107;
        overallRating: 98;
    };
}>;

export type OrderAccounting = {
    usedFees: Fee[];
};

// TODO: rename to Order
export type Load = {
    publicId: string;
    details: OrderDetails;
    pickupInformation: OrderPickupInformation;
    deliveryInformation: OrderDeliveryInformation;
    customerInformation: OrderCustomerInformation;
    paymentInformation: OrderPaymentInformation;
    vehicles: OrderVehicle[];
    commodities: OrderCommodity[];
    products?: (OrderVehicle | OrderCommodity)[];
    expenses: OrderExpense[];
    driver: User | null;
    dispatcher: User | null;
    company: Company;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
    drivingDistance?: number;
    latestInternalNote: OrderInternalNote;
    sendInvoiceAt: string | null;
    paidAt: string | null;
    isFlagged: boolean;
    countOfNewRequests: number;
    carrierOrder?: CarrierOrder | null;
    shipperOrder?: ShipperOrder | null;
    payment: OrderPayment | null;
    latestOffer?: OrderOffer | null;
    archivedAt: string | null;
    deletedAt: string | null;
    deliveredAt: string | null;
    acceptedAt: string | null;
    pickedUpAt: string | null;
    createdAt: string;
    creator: Creator;
    fundsTransferStatus?: FundsTransferStatus;
    fundsTransferredAt: string | null;
    fundsTransferUpdatedAt: string | null;
    latestRequest?: OrderRequest | null;
    postedAt: string;
    source: OrderSourcesEnum | null;
    contractCheckedAt?: string;
    driverFeeChargeConfirmed: boolean;
    driverFeeCharge?: BalanceValue;
    driverDelayedPayment?: BalanceValue;
    userOrderStatus?: UserOrderStatus;
    hasInopVehicles?: boolean;
    driverRequests?: OrderRequest[];
    contractFoundAt: string | null;
    contractSignedAt?: string;
    externalContractChangedAt?: string;
    externalShipper?: ExternalCDShipper | ExternalSDShipper | null;
    type: OrderType;
    fullPrice: number | null;
    price: number | null;
    instantTermPaymentType: InstantTermPaymentType | null;
    instantTermPaymentMethod: InstantTermPaymentMethod;
    instantTermDeclinedAt: string | null;
    instantTermPaymentDeclineReason: string | null;
    instantTermPaidAt: string | null;
    accounting?: OrderAccounting | null;
    cdContract?: Attachment | null;
};

export type OrderFormState = Omit<
    Partial<Load>,
    | 'cdContract'
    | 'vehicles'
    | 'commodities'
    | 'expenses'
    | 'details'
    | 'deliveryInformation'
    | 'pickupInformation'
    | 'customerInformation'
    | 'paymentInformation'
> &
    Partial<{
        details: Partial<OrderDetails>;
        pickupInformation: Partial<
            OrderPickupInformation & {
                createNewContact: boolean;
            }
        >;
        deliveryInformation: Partial<
            OrderDeliveryInformation & {
                createNewContact: boolean;
            }
        >;
        customerInformation: Partial<
            OrderCustomerInformation & {
                createNewContact: boolean;
            }
        >;
        paymentInformation: Partial<OrderPaymentInformation>;
        vehicles: Partial<OrderVehicle>[];
        commodities: Partial<OrderCommodity>[];
        expenses: Partial<OrderExpense>[];
        status: OrderStatus;
        paymentStatus: OrderPaymentStatus;
        isArchived: boolean;
        isRestored: boolean;
        driverId: string | null;
        dispatcherId: string | null;
        attachments: Array<File>;
        cdContract: Array<File>;
        bolAttachments: Array<File>;
        podAttachments: Array<File>;
        otherOrderValues: Array<File>;
        payment: OrderPayment | null;
        deletedVehicles: number[];
        deletedCommodities: number[];
        deletedExpenses: string[];
        fundsTransferStatus: FundsTransferStatus;
        isExternalContractChangesAccepted: boolean;
        instantTermPaymentType: InstantTermPaymentType | null;
    }>;

export type OrderVehicleDrawerState = {
    isVisible: boolean;
    vehicleId: number | null;
};

export type OrderCommodityDrawerState = {
    isVisible: boolean;
    commodityId: string | null;
};

export type DeleteOrderExpensePopupState = {
    isVisible: boolean;
    expenseId: string | null;
    expenseType: string | null;
};

export type DeleteOrderAttachmentPopupState = {
    isVisible: boolean;
    attachmentToDelete: Attachment | null;
    orderPublicId: string | null;
};

export type RecalculateOrderTransactionsPopupState = {
    isVisible: boolean;
    orderPublicId: string | null;
    orderId: string | null;
};

export type MarkAsDocumentsRequestedPopupState = {
    isVisible: boolean;
    orderPublicId: string | null;
    orderId: string | null;
};

export type OrderExpenseDrawerState = {
    isVisible: boolean;
    expenseId: string | null;
};

export type OrderSendOfferToCarrierDrawerState = {
    isVisible: boolean;
    requestId?: string;
    orderId: string | null;
    order?: Load | null;
};

export type OrderChatDrawerState = {
    isVisible: boolean;
    orderPublicId: string | null;
};

export type OrdersSliceState = {
    order: Load | null;

    pickupInformationDrawer: OrderPickupInformationDrawerState;
    deliveryInformationDrawer: OrderDeliveryInformationDrawerState;
    customerInformationDrawer: OrderCustomerInformationDrawerState;
    paymentInformationDrawer: OrderPaymentInformationDrawerState;
    driverDrawer: OrderSetDriverDrawerState;
    dispatcherDrawer: OrderSetDispatcherDrawerState;
    orderExpenseDrawer: OrderExpenseDrawerState;
    orderVehicleDrawer: OrderVehicleDrawerState;
    orderCommodityDrawer: OrderCommodityDrawerState;
    driverInstructionsDrawer: OrderDriverInstructionsDrawerState;
    orderDetailsDrawer: OrderDetailsDrawerState;
    orderActivityDetailsDrawer: OrderActivityDetailsDrawerState;
    sendBOLDrawer: OrderSendBOLDrawerState;
    sendInvoiceDrawer: OrderSendInvoiceDrawerState;
    markAsPaidDrawer: OrderMarkAsPaidDrawerState;
    sendOfferToCarrierDrawer: OrderSendOfferToCarrierDrawerState;
    orderChatDrawer: OrderChatDrawerState;
    driverPaymentFormDrawer: OrderDriverPaymentFormDrawerDrawerState;
    isCreateOrderFromFileLoading: boolean;

    editOrderAttachmentsIdsToDelete: string[] | null;
    unasignDriverPopup: UnasignDriverPopupState;
    markAsNewPopup: MarkAsNewPopupState;
    markAsDeliveredPopup: MarkAsDeliveredPopupState;
    deleteOrderPopupState: DeleteOrderPopupState;
    restoreOrderPopup: RestoreOrderPopupState;
    deleteOrderVehiclePopup: DeleteOrderVehiclePopupState;
    deleteOrderCommodityPopup: DeleteOrderCommodityPopupState;
    markAsPickedUpPopup: MarkAsPickedUpPopupState;
    deleteInternalNotePopup: DeleteInternalNotePopupState;
    createEditInternalNotePopup: CreateEditInternalNotePopupState;
    deleteOrderExpensePopup: DeleteOrderExpensePopupState;
    deleteOrderAttachmentPopup: DeleteOrderAttachmentPopupState;
    recalculateOrderTransactionsPopup: RecalculateOrderTransactionsPopupState;
    markAsDocumentsRequestedPopup: MarkAsDocumentsRequestedPopupState;
};

export type BaseOrderPopupState = {
    isVisible: boolean;
    publicOrderId: string | null;
};

export type UnasignDriverPopupState = BaseOrderPopupState;
export type MarkAsNewPopupState = BaseOrderPopupState;
export type MarkAsPickedUpPopupState = BaseOrderPopupState;
export type MarkAsDeliveredPopupState = BaseOrderPopupState;
export type DeleteOrderPopupState = BaseOrderPopupState & {
    orderId: string | null;
};
export type RestoreOrderPopupState = BaseOrderPopupState;

export type DeleteOrderVehiclePopupState = {
    isVisible: boolean;
    vehicleId: number | null;
    vehicleMake: string | null;
    vehicleModel: string | null;
};

export type VehicleFormState = Partial<{
    vin: string;
    year: string;
    make: string;
    model: string;
    type: string;
    color: string;
    lotNumber: string;
    price: string;
    inop: boolean;
    enclosed: boolean;
}>;

export type DeleteOrderCommodityPopupState = {
    isVisible: boolean;
    commodityId: string | null;
    commodityName: string | null;
    commodityDescription: string | null;
};

export type CommodityFormState = Partial<OrderCommodity>;

export type CreateEditInternalNotePopupState = {
    isVisible: boolean;
    internalNoteId?: string | null;
    publicOrderId: string | null | undefined;
    initialText?: string;
    mode: ModeStateEnum | null;
};

export type DeleteInternalNotePopupState = {
    isVisible: boolean;
    internalNoteId: string | null;
    publicOrderId: string | null | undefined;
};

export type SendOfferToCarrierFormState = {
    carrierDeliveryTypeDate: string;
    carrierPickupTypeDate: string;
    carrierPrice: number;
    carrierPickupAt: string;
    carrierDeliveryAt: string;
    delayedPayment?: number | null;
    brokerFee?: number | null;
};

export enum ModeStateEnum {
    CREATE = 'create',
    EDIT = 'edit',
}

export enum OrderFormEnum {
    GENERAL = 'orderGeneralForm',
    GENERAL_WITH_REDIRECT = 'orderGeneralFormWithRedirect',
    SEND_BOL = 'orderSendBOLForm',
    SEND_INVOICE = 'orderSendInvoiceForm',
    MARK_AS_PAID = 'orderMarkAsPaidForm',
}

export enum OrderFieldsGroup {
    DETAILS = 'details',
    PICKUP_INFORMATION = 'pickupInformation',
    DELIVERY_INFORMATION = 'deliveryInformation',
    CUSTOMER_INFORMATION = 'customerInformation',
    PAYMENT_INFORMATION = 'paymentInformation',
    VEHICLES = 'vehicles',
    EXPENSES = 'expenses',
    PAYMENT = 'payment',
    COMMODITIES = 'commodities',
}
