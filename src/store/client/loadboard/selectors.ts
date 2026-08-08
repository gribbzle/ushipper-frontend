import { AppState } from "@store";
import { BetweenPhonesChatDrawerState, CheckingContractPopup, LoadboardList, LoadboardNoticePopup, SavedSearches } from './types';

const loadboardSelector = (state: AppState) => state.client.loadboard;

export const loadboardListSelector = (state: AppState): LoadboardList => loadboardSelector(state).list;

export const isSearchAlongRouteSelector = (state: AppState): boolean => loadboardSelector(state).list.isSearchAlongRoute;

export const loadboardSavedSearchesSelector = (state: AppState): SavedSearches => loadboardSelector(state).savedSearches;

export const checkingContractPopupSelector = (state: AppState): CheckingContractPopup => loadboardSelector(state).checkingContractPopup;

export const loadboardNoticePopupSelector = (state: AppState): LoadboardNoticePopup => loadboardSelector(state).loadboardNoticePopup;

export const loadboardCallingPopupStateSelector = (state: AppState) => state.client.loadboard.callingPopupState;

export const isRegisterTwilioSuccessSelector = (state: AppState) => loadboardSelector(state).isRegisterTwilioSuccess;

export const isCheckContractLoadingSelector = (state: AppState) => loadboardSelector(state).isCheckingContractLoading;

export const loadboardBetweenPhonesChatDrawerStateSelector = (state: AppState): BetweenPhonesChatDrawerState =>
    state.client.loadboard.betweenPhonesChatDrawerState;
