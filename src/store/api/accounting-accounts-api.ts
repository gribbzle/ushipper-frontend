import { AccountStatusesEnum } from '@enums';
import { accountingActions, BalanceResource, BalanceValue, BillingAddress, Company, FinancialBalanceData, MaskedBankAccount, MaskedCard } from '@store/admin';
import { DeviceInformation, LatestLocation } from '@store/client';
import { AccountData, AccountProfileData, AccountSuperiorUser, AccountUser, ParentData } from '@store/client/accounts';
import { Fee } from '@types';
import { PaginatedResponse } from '@utils';

import { apiSlice } from './api-slice';

export type GetAccountingAccountsParams = {
    name: string;
    phone: string;
    email: string;
    status: string;
    companyId: string;
    companyIds: string[];
    amountType: 'positive' | 'negative';
    orderName: string;
    orderDirection: string;
    page: number;
    perPage: number;
    lastPage: number;
    cursor: string | null;
};

export type AccountingAccountParentData = Pick<ParentData, 'publicId' | 'name'>;

export type AccountingAccountBalanceData = BalanceResource &
    Omit<FinancialBalanceData, 'accountingProfileId' | 'accountId' | 'accountName' | 'bankAccount' | 'card' | 'billingAddress'> & {
        displayedBalance?: BalanceValue;
        bankAccount?: MaskedBankAccount;
        card?: MaskedCard;
        billingAddress?: BillingAddress;
    };

export type AccountingAccountUserCompanyData = Pick<Company, 'publicId' | 'name' | 'type' | 'isPartner' | 'fees'> | null;

export type AccountingAccountUserData = {
    publicId: string;
    company: AccountingAccountUserCompanyData;
    name: string;
    superiorUser?: AccountSuperiorUser | null;
    createdAt: string;
    role: { id: number };
};

export type AccountingAccountRatingData = {
    reviewsTotal: number | null;
    dispatcherReviewsTotal: number;
    dispatcherRating: number | null;
    driverReviewsTotal: number;
    driverRating: number | null;
};

type AccountingAccountDeviceInformationData = DeviceInformation & {
    outdatedApplicationVersion: boolean;
};

export type AccountingAccountTransactionsData = {
    total: number;
    cashOutSum: BalanceValue;
};

export type AccountingAccountOrdersData = {
    total: number;
    pending: number;
    documentsRequested: number;
    damageClaimed: number;
    pendingSum: BalanceValue | null;
};

export type AccountingAccountOwnerUser = Pick<AccountUser, 'avatar'>;

export type AccountingAccountData = Pick<
    AccountData,
    'id' | 'publicId' | 'name' | 'email' | 'phone' | 'createdAt' | 'updatedAt' | 'phoneVerifiedAt' | 'emailVerifiedAt'
> & {
    parent: AccountingAccountParentData | null;
    orders: AccountingAccountOrdersData;
    accountingProfile: AccountProfileData | null;
    fees: Fee[];
    rating: AccountingAccountRatingData;
    deviceInformation: AccountingAccountDeviceInformationData | null;
    transactions: AccountingAccountTransactionsData;
    balances: AccountingAccountBalanceData[];
    users: AccountingAccountUserData[];
    latestLocation: LatestLocation | null;
    ownerUser: AccountingAccountOwnerUser;
    childrenCount: number;
    telegramId: string | null;
    status: AccountStatusesEnum;
};

export const accountingAccountsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAccountingAccounts: builder.query<PaginatedResponse<AccountingAccountData[]>, Partial<GetAccountingAccountsParams>>({
            query: params => ({
                url: 'accounting-accounts',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<AccountingAccountData[]> }) => response.data,
            providesTags: [{ type: 'AccountingAccounts', id: 'LIST' }],
            onQueryStarted(args, { queryFulfilled, dispatch }) {
                queryFulfilled.then(({ data }) => {
                    const accounts = data.data;

                    accounts.forEach(account => {
                        dispatch(accountingActions.updateSelectedAccount(account));
                    });
                });
            },
        }),
        getAccountingAccount: builder.query<AccountingAccountData, string>({
            query: accountPublicId => ({
                url: `accounting-accounts/${accountPublicId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: { data: AccountingAccountData } }) => response.data.data,
            providesTags: (_response, _error, publicId) => [{ type: 'AccountingAccounts', id: publicId }],
        }),
    }),
});

export const { useGetAccountingAccountsQuery, useLazyGetAccountingAccountsQuery, useGetAccountingAccountQuery, useLazyGetAccountingAccountQuery } =
    accountingAccountsApi;
