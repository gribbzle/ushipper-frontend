import { OrderCommodity, OrderVehicle } from '@store/api/orders-api';
import { OrderPaymentInformation } from '@store/client';

export type MileCostTooltipProps = {
    drivingDistance?: number;
    paymentInformation: OrderPaymentInformation;
    vehicles?: OrderVehicle[];
    commodities?: OrderCommodity[];
    classNameTitle?: string;
};
