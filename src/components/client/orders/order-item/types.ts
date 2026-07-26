import { ReactElement } from 'react';

import { FundsTransferStatus, InspectionType, InstantTermPaymentType, OrderStatus } from '@/enums';
import { BalanceValue } from '@store/admin';
import { PaymentInformation } from '@store/api/orders-api';
import { Load } from '@store/client';
import { ShipperOrder } from '@store/client';

export type OrderItemProps = {
    order: Load;
};

export type OrderItemHeaderProps = {
    orderId: string | null;
    inspectionType: InspectionType | null;
    status: OrderStatus;
    paymentInformation: PaymentInformation;
    Tag?: ReactElement;
    orderPublicId?: string;
    isFlagged: boolean;
    shipperOrder?: ShipperOrder | null;
    fundsTransferStatus?: FundsTransferStatus;
    instantTermPaymentType?: InstantTermPaymentType | null;
    driverFeeCharge?: BalanceValue;
    driverDelayedPayment?: BalanceValue;
    externalContractChangedAt?: string;
    driverOrderPrice?: number | null;
};
