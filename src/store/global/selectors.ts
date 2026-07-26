import { AppState } from '..';

export const authSelector = (state: AppState) => state.global;

export const isUserAuthorizedSelector = (state: AppState) => state.global.fetchUserStatus === 200;

export const authorizedUserSelector = (state: AppState) => state.global.user;

export const accountUserSelector = (state: AppState) => authSelector(state).accountUser;

export const accountSelector = (state: AppState) => authSelector(state).account;

export const accountUsersSelector = (state: AppState) => accountSelector(state)?.users;

export const authorizedAccountParentIdSelector = (state: AppState) => {
    const account = accountSelector(state);

    return account?.parentId;
};

export const authorizedAccountPublicIdSelector = (state: AppState) => {
    const account = accountSelector(state);

    return account?.publicId;
};

export const permissionsSelector = (state: AppState) => state.global.permissions;

export const authorizedUserNameSelector = (state: AppState) => state.global.user?.name;

export const authorizedUserCompanyPublicIdSelector = (state: AppState) => state.global.user?.companyPublicId;

export const authorizedUserAccountPublicIdSelector = (state: AppState) => state.global.user?.accountPublicId;

export const authorizedUserPublicIdSelector = (state: AppState) => state.global.user?.publicId;

export const authorizedUserTwilioPhoneSelector = (state: AppState) => state.global.user?.twilioPhone;

export const authorizedUserDefaultBalanceSelector = (state: AppState) => {
    const { balances } = state.global.user || {};

    return balances?.find(balance => balance.isDefault);
};

export const driverPaymentRequestsCounterSelector = (state: AppState) => state.global.driverPaymentRequestsCounter;

export const isDriverPayCounterInitSelector = (state: AppState) => state.global.driverPaymentRequestsCounterStatus === 200;

export const issuesCounterSelector = (state: AppState) => state.global.issuesCounter;

export const isIssuesCounterInitSelector = (state: AppState) => state.global.issuesCounterStatus === 200;
