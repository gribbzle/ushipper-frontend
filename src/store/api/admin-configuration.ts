import { CompanyType, PerformTransactionEventEnum, RegistrationType, TransactionSystemEnum } from '@/enums';

import { apiSlice } from './api-slice';

export type RegistrationSettings = {
    registration: {
        type: string;
        confirmationMethods: Record<CompanyType, RegistrationType>;
    };
    fuelCards: {
        autoFuelCardTransactionsProcessing: boolean;
        defaultRateNew: number; // Integer
        defaultRatePickedUp: number; // Integer
        defaultRateDef: number; // Integer
        ulsdConversionRate: number; // Float
        defConversionRate: number; // Float
    };
    transaction: {
        cashinAccountingSystem: TransactionSystemEnum;
        cashoutAccountingSystem: TransactionSystemEnum;
        performTransactionEvent: PerformTransactionEventEnum;
        accountingSystemTestAccounts?: string[];
    };
};

const adminConfigurationApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAdminConfig: builder.query<RegistrationSettings, void>({
            query: () => ({
                url: 'admin/config',
                method: 'GET',
            }),
            transformResponse: (response: { data: RegistrationSettings }) => response.data,
        }),
        postAdminConfig: builder.mutation<void, Partial<RegistrationSettings>>({
            query: data => ({
                url: 'admin/config',
                method: 'PATCH',
                data,
            }),
        }),
    }),
});

export const { useGetAdminConfigQuery, usePostAdminConfigMutation } = adminConfigurationApi;
