import { OrderItemHeaderProps } from '../types';

export type DriverPayInfoProps = Pick<
    OrderItemHeaderProps,
    'fundsTransferStatus' | 'paymentInformation' | 'status' | 'driverFeeCharge' | 'driverDelayedPayment' | 'instantTermPaymentType'
>;
