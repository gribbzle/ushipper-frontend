import { OrderRequest } from '@store/api/order-requests-types';
import { Load } from '@store/common/orders/types';

export type SendOfferDrawer = {
    isOpen: boolean;
    order?: Load;
    request?: OrderRequest;
};
export type RequestsSliceState = {
    sendOfferDrawer: SendOfferDrawer;
};
