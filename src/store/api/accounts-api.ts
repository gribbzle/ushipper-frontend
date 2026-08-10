import { RocketkorFormValue } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/rocketkor.types';
import { DocumentFormValue } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/rocketkor-form/document-form/document-form.types';
import { AccountStatusesEnum } from '@/enums/account/account-statuses-enum';
import { DriverLoadboardPaymentTermEnum } from '@/enums/driver-loadboard-payment-terms-enum';
import { MassPayUserTypesEnum } from '@/enums/account/masspay-user-types-enum';
import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { UserRoleType } from '@/enums/user-role-type';
import { Attachment } from '@/shared';
import { toFormData } from '@/utils/to-form-data';
import { BalanceValue } from '@store/admin/accounting/balance-types';
import { AccountData, AccountProfileData } from '@store/client/accounts';
import { PaginatedResponse } from '@utils/redux';

import { apiSlice } from './api-slice';

export type DocumentType = 'tax_document' | 'ownership_document' | 'passport';

export type GetAccountsParams = {
    name: string;
    phone: string;
    email: string;
    type: UserRoleType;
    companyId: string[];
    orderName: string;
    orderDirection: string;
    parentId: string;
    publicIds?: string[];
    page: number;
    perPage: number;
    lastPage: number;
};

export type AccountingProfileDocument = {
    country: string;
    createdAt: string;
    description: string;
    expiryDate: string;
    issuingDate: string;
    name: string;
    publicId: string;
    state: string;
    type: DocumentType;
    updatedAt: string;
    attachment: Attachment;
    number: string;
};

export type AccountPathData = {
    parentId: string | null;
    status: AccountStatusesEnum;
    phoneVerifiedAt: string;
    emailVerifiedAt: string;
};

export type AccountingProfileParams = {
    accountId: string;
    accountingProfileId: string;
    type: DocumentType;
};

export type AccountConfigData = {
    driverMinimalBalance: number | null;
    loadboardPaymentTerms: DriverLoadboardPaymentTermEnum | null;
    ordersShowFullPrice: boolean;
    loadboardSources: OrderSourcesEnum[];
    orderRequestsAllowed: boolean;
    fuelLimitEnabled: boolean;
    fuelLimitRateNew: number | null;
    fuelLimitRatePickedUp: number | null;
    fuelLimitRateDef: number | null;
};

export type AccountConfigPatchData = Omit<AccountConfigData, 'fuelLimitEnabled'>;

export type MassPayAttribute = {
    token: string;
    value: string;
};

export type MassPayValues = {
    paymentMethodId: string;
    attributes: MassPayAttribute[];
};

export type AccountPaymentMethod = 'fluidpay' | 'masspay';

export type AccountPaymentMethodValues = {
    balanceId: string;
    paymentMethodType: AccountPaymentMethod;
    masspay: MassPayValues;
};

export type AccountInitiatePaymentMethodValues = {
    paymentMethodType: AccountPaymentMethod;
    balanceId: string;
    amount: number;
};

export type MassPayPayerDTO = {
    token: string;
    name: string;
    logo: string;
    estimatedAvailability: string;
    additionalDescription: string;
    sourceAmount: BalanceValue;
    fee: BalanceValue;
};

export type MassPayCompanyDTO = {
    name: string;
    logo: string;
    description: string;
    rating: number;
};

export type MassPayInputType = 'text' | 'options' | 'date';

export type MassPayUserAttributeDTO = {
    token: string;
    label: string;
    type: MassPayUserTypesEnum;
    inputType: MassPayInputType;
    isOptional: boolean;
    validation: string | null;
    value: string | null;
};

export type InitiateMassPayPaymentMethod = {
    paymentMethodId: string;
    payer: MassPayPayerDTO;
    company: MassPayCompanyDTO;
    attributes: MassPayUserAttributeDTO[];
};

export type AccountInitiatePaymentMethod = {
    paymentMethodType: AccountPaymentMethod;
    masspay: InitiateMassPayPaymentMethod;
};

export const accountsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAccount: builder.query<AccountData, string>({
            query: accountPublicId => ({
                url: `accounts/${accountPublicId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: AccountData }) => response.data,
        }),
        getAccounts: builder.query<PaginatedResponse<AccountData[]>, Partial<GetAccountsParams>>({
            query: params => ({
                url: 'accounts',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<AccountData[]> }) => response.data,
            providesTags: [{ type: 'Accounts', id: 'LIST' }],
        }),
        partiallyUpdateAccount: builder.mutation<AccountData, { accountId: string; data: Partial<AccountPathData> }>({
            query: ({ accountId, data }) => ({
                url: `accounts/${accountId}`,
                method: 'patch',
                data,
            }),
        }),
        getAccountingProfile: builder.query<AccountProfileData, string>({
            query: accountId => ({
                url: `accounts/${accountId}/accounting-profiles`,
                method: 'get',
            }),
            providesTags: [{ type: 'AccountingProfile', id: 'ID' }],
            transformResponse: (response: { data: AccountProfileData[] }) => response.data[0],
        }),
        createAccountingProfile: builder.mutation<
            AccountProfileData,
            Omit<RocketkorFormValue, 'areAddressesSame'> & Pick<AccountingProfileParams, 'accountId'>
        >({
            query: ({ accountId, ...data }) => ({
                url: `accounts/${accountId}/accounting-profiles`,
                method: 'post',
                data,
            }),
            transformResponse: (response: { data: AccountProfileData }) => response.data,
        }),
        updateAccountingProfile: builder.mutation<unknown, Omit<RocketkorFormValue, 'areAddressesSame'> & Omit<AccountingProfileParams, 'type'>>({
            query: ({ accountId, accountingProfileId, ...data }) => ({
                url: `accounts/${accountId}/accounting-profiles/${accountingProfileId}`,
                method: 'patch',
                data,
            }),
        }),
        sendAccountingProfileDocument: builder.mutation<unknown, DocumentFormValue & AccountingProfileParams>({
            query: ({ accountId, accountingProfileId, ...data }) => {
                const { files, ...fields } = data;
                const file = files[0];

                const formData = toFormData(fields);

                formData.append('file', file);

                return {
                    url: `accounts/${accountId}/accounting-profiles/${accountingProfileId}/accounting-profile-documents`,
                    method: 'post',
                    data: formData,
                    formData: true,
                };
            },
        }),
        updateAccountingProfileDocument: builder.mutation<unknown, DocumentFormValue & AccountingProfileParams & { documentId: string }>({
            query: ({ accountId, accountingProfileId, documentId, ...data }) => {
                const { files, ...fields } = data;
                const file = files[0];

                const formData = toFormData(fields);

                if (file) {
                    formData.append('file', file);
                }

                return {
                    url: `accounts/${accountId}/accounting-profiles/${accountingProfileId}/accounting-profile-documents/${documentId}`,
                    method: 'post',
                    data: formData,
                    formData: true,
                };
            },
        }),
        getAccountingProfileDocuments: builder.query<AccountingProfileDocument[], Omit<AccountingProfileParams, 'type'>>({
            query: ({ accountId, accountingProfileId }) => ({
                url: `accounts/${accountId}/accounting-profiles/${accountingProfileId}/accounting-profile-documents`,
                method: 'get',
            }),
            providesTags: [{ type: 'RocketkorDocuments', id: 'LIST' }],
            transformResponse: (response: { data: AccountingProfileDocument[] }) => response.data,
        }),
        deleteAccountingProfileDocument: builder.mutation<AccountingProfileDocument[], Omit<AccountingProfileParams, 'type'> & { documentId: string }>({
            query: ({ accountId, accountingProfileId, documentId }) => ({
                url: `accounts/${accountId}/accounting-profiles/${accountingProfileId}/accounting-profile-documents/${documentId}`,
                method: 'delete',
            }),
        }),
        deleteAccount: builder.mutation<void, string>({
            query: accountId => ({
                url: `accounts/${accountId}`,
                method: 'delete',
            }),
        }),
        getAccountConfig: builder.query<AccountConfigData, string>({
            query: accountPublicId => ({
                url: `accounts/${accountPublicId}/config`,
                method: 'get',
            }),
            transformResponse: (response: { data: AccountConfigData }) => response.data,
        }),
        updateAccountConfig: builder.mutation<AccountConfigData, { accountPublicId: string; data: AccountConfigPatchData }>({
            query: ({ accountPublicId, data }) => ({
                url: `accounts/${accountPublicId}/config`,
                method: 'patch',
                data,
            }),
            transformResponse: (response: { data: AccountConfigData }) => response.data,
        }),
        createAccountPaymentMethods: builder.mutation<void, { accountPublicId: string; data: AccountPaymentMethodValues }>({
            query: ({ accountPublicId, data }) => ({
                url: `accounts/${accountPublicId}/payment-methods`,
                method: 'post',
                data,
            }),
        }),
        initiateAccountPaymentMethods: builder.mutation<AccountInitiatePaymentMethod, { accountPublicId: string; data: AccountInitiatePaymentMethodValues }>({
            query: ({ accountPublicId, data }) => ({
                url: `accounts/${accountPublicId}/payment-methods/initiate`,
                method: 'post',
                data,
            }),
            transformResponse: (response: { data: AccountInitiatePaymentMethod }) => response.data,
        }),
    }),
});

export const {
    useGetAccountQuery,
    useLazyGetAccountQuery,
    useGetAccountsQuery,
    useLazyGetAccountsQuery,
    usePartiallyUpdateAccountMutation,
    useDeleteAccountMutation,
    useGetAccountingProfileQuery,
    useCreateAccountingProfileMutation,
    useSendAccountingProfileDocumentMutation,
    useGetAccountingProfileDocumentsQuery,
    useUpdateAccountingProfileMutation,
    useUpdateAccountingProfileDocumentMutation,
    useDeleteAccountingProfileDocumentMutation,
    useGetAccountConfigQuery,
    useUpdateAccountConfigMutation,
    useCreateAccountPaymentMethodsMutation,
    useInitiateAccountPaymentMethodsMutation,
} = accountsApi;
