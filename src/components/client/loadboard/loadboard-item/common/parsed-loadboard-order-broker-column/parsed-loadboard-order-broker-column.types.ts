import { OrderSourcesEnum } from '@/enums';
import { CustomerInformation } from '@store/api/orders-api';
import { ExternalCDShipper, ExternalSDShipper, OrderDetails } from '@store/client';

export type ParsedLoadBoardOrderBrokerColumnProps = {
    company: CustomerInformation;
    details: OrderDetails;
    orderSource: OrderSourcesEnum | null;
    externalShipper?: ExternalCDShipper | ExternalSDShipper | null;
};
