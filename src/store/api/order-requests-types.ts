import { OfferToRequestStatusesEnum, PaymentMethod, RequestStatusesEnum } from '@/enums';
import { PaymentTerm } from '@/enums/payment-term';
import { Company } from '@store/admin/companies/types';
import { User } from '@store/common/staff/types';

export type NewOffer = {
    publicId: string;
    paymentPrice: number;
    paymentTerms: PaymentTerm;
    createdAt: string;
    declinedAt: string | null;
    canceledAt: string | null;
    status: OfferToRequestStatusesEnum;
    brokerFee: number | null;
    delayedPayment: number | null;
};

export type OrderRequest = {
    carrierCompany: Company;
    comment: string;
    createdAt: string;
    creator: User;
    deliveryAt: string;
    paymentMethod: PaymentMethod;
    paymentPrice: number;
    pickupAt: string;
    publicId: string;
    status: RequestStatusesEnum;
    latestOffer: NewOffer | null;
    declinedAt: string | null;
    canceledAt: string | null;
    type?: 'company_to_company' | 'driver_to_dispatcher';
};

export type OrderRequestCreateArg = {
    paymentPrice: number;
    pickupAt: string;
    deliveryAt: string;
    comment: string;
    contactName: string;
};
