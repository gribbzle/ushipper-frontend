export type CountOfRequests = {
    countOfNewRequests: number;
};

export type RequestCountEvent = {
    order: {
        orderId: string;
    } & CountOfRequests;
} & CountOfRequests;

export type OffersCountEvent = {
    shipperCompany: {
        countOfNewOffers: number;
    };
    carrierCompany: {
        countOfNewOffers: number;
    };
};

export type OrdersCountEvent = {
    countOfNewOrders: number;
};
