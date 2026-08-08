import { OrderCommodity } from '@store/api/orders-api';
import { OrderVehicle } from '@/shared/types';
import { OrderPaymentInformation } from '@store/client';

export type MileCostTooltipProps = {
    drivingDistance?: number;
    paymentInformation: OrderPaymentInformation;
    vehicles?: OrderVehicle[];
    commodities?: OrderCommodity[];
    classNameTitle?: string;
};
