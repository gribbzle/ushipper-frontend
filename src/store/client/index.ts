import { Action, combineReducers } from '@reduxjs/toolkit';

import { accountsReducer } from '@store/client/accounts/slice';
import { loadboardReducer } from '@store/client/loadboard/slice';
import { requestsSliceReducer } from '@store/client/requests/slice';
import { reviewSliceReducer } from '@store/client/review/slice';

import { ordersReducer } from '../common';

import { catalogsReducer } from './catalogs/slice';
import { jobOffersReducer } from './job-offers/slice';
import { orderBOLReducer } from './order-BOL';
import { signInReducer } from './sign-in';
import { signUpReducer } from './sign-up';
import { trackingReducer } from './tracking';
import { walletReducer } from './wallet';

export * from './sign-in';
export * from './sign-up';
export * from './accounts';
export * from '../common/staff';
export * from '../common/contacts';
export * from '../common';
export * from './tracking';
export * from './review';
export * from './job-offers';
export * from './catalogs';
export * from './wallet';

type ClientState = {
    accounts: ReturnType<typeof accountsReducer>;
    signIn: ReturnType<typeof signInReducer>;
    signUp: ReturnType<typeof signUpReducer>;
    orders: ReturnType<typeof ordersReducer>;
    orderBOL: ReturnType<typeof orderBOLReducer>;
    tracking: ReturnType<typeof trackingReducer>;
    loadboard: ReturnType<typeof loadboardReducer>;
    requests: ReturnType<typeof requestsSliceReducer>;
    review: ReturnType<typeof reviewSliceReducer>;
    jobOffers: ReturnType<typeof jobOffersReducer>;
    catalogs: ReturnType<typeof catalogsReducer>;
    wallet: ReturnType<typeof walletReducer>;
};

export const clientReducer = combineReducers<ClientState, Action>({
    accounts: accountsReducer,
    signIn: signInReducer,
    signUp: signUpReducer,
    orders: ordersReducer,
    orderBOL: orderBOLReducer,
    tracking: trackingReducer,
    loadboard: loadboardReducer,
    requests: requestsSliceReducer,
    review: reviewSliceReducer,
    jobOffers: jobOffersReducer,
    catalogs: catalogsReducer,
    wallet: walletReducer,
});
