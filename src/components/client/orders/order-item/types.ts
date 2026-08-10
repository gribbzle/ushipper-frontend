import { ReactElement } from 'react';

import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { InspectionType } from '@/enums/inspection-type';
import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { OrderStatus } from '@/enums/order-status';
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
