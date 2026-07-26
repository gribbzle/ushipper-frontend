import { AppState } from '@store';

import { SelectedActiveRequest, SelectedShipperTrackingOrder } from './types';

const trackingPageSelector = (state: AppState) => state.client.tracking;

export const fetchedIsDriversListShownSelector = (state: AppState) => {
    const { isDriversListShown } = trackingPageSelector(state);

    return isDriversListShown;
};

export const fetchedSelectedDriverIdSelector = (state: AppState) => {
    const { selectedDriverId } = trackingPageSelector(state);

    return selectedDriverId;
};

export const selectedDriverOrderIdSelector = (state: AppState) => {
    return state.client.tracking.selectedDriverOrderId;
};

export const selectedIsTestRoutePathLogic = (state: AppState) => {
    return state.client.tracking.testRoutePathLogic;
};

export const selectedSuggestedOrderIdSelector = (state: AppState) => trackingPageSelector(state)?.selectedSuggestedOrderId;

export const openShipperTrackingFiltersSelector = (state: AppState): boolean => trackingPageSelector(state)?.openShipperTrackingFilters;

export const isShipperOrdersListShownSelector = (state: AppState): boolean => {
    const { isShipperOrdersListShown } = trackingPageSelector(state);

    return isShipperOrdersListShown;
};

export const selectedShipperTrackingOrderSelector = (state: AppState): SelectedShipperTrackingOrder => {
    const { selectedShipperTrackingOrder } = trackingPageSelector(state);

    return selectedShipperTrackingOrder;
};

export const isShipperOrdersTrackingLoadingSelector = (state: AppState): boolean => {
    const { isShipperOrdersTrackingLoading } = trackingPageSelector(state);

    return isShipperOrdersTrackingLoading;
};

export const selectedActiveRequestSelector = (state: AppState): SelectedActiveRequest => {
    const { selectedActiveRequest } = trackingPageSelector(state);

    return selectedActiveRequest;
};
