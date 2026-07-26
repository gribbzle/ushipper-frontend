import { OrderRequest } from '@store/api/order-requests-api';
import { Load } from '@store/client';

export type SendOfferDrawer = {
    isOpen: boolean;
    order?: Load;
    request?: OrderRequest;
};
export type RequestsSliceState = {
    sendOfferDrawer: SendOfferDrawer;
};
