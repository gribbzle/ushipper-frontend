import { apiSlice } from '@store/api/api-slice';
import { CompanyExternalServiceParams, CompanyExternalServiceSettings, ExternalServiceCredentialsRequest, FactoringEmailSettingsRequest } from '@/types/company-external-service-settings';

export const companyExternalServiceSettingsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCompanyExternalServiceSettings: builder.query<CompanyExternalServiceSettings, CompanyExternalServiceParams>({
            query: ({ companyId, type }) => {
                return {
                    url: `companies/${companyId}/external-service-settings/${type}`,
                    method: 'get',
                };
            },
            transformResponse: (response: { data: CompanyExternalServiceSettings }) => response.data,
        }),
        createCompanyExternalServiceSettings: builder.mutation<
            CompanyExternalServiceSettings,
            ExternalServiceCredentialsRequest | FactoringEmailSettingsRequest
        >({
            query: ({ companyId, type, ...values }) => {
                return {
                    url: `companies/${companyId}/external-service-settings/${type}`,
                    method: 'post',
                    data: values,
                };
            },
            transformResponse: (response: { data: CompanyExternalServiceSettings }) => response.data,
        }),
        createCompanyExternalServiceSettingsLogin: builder.mutation<CompanyExternalServiceSettings, ExternalServiceCredentialsRequest>({
            query: ({ companyId, type, ...values }) => {
                return {
                    url: `companies/${companyId}/external-service-settings/${type}/login`,
                    method: 'post',
                    data: values,
                };
            },
            transformResponse: (response: { data: CompanyExternalServiceSettings }) => response.data,
        }),
        createCompanyExternalServiceSettingsConfirmLogin: builder.mutation<CompanyExternalServiceSettings, ExternalServiceCredentialsRequest>({
            query: ({ companyId, type, ...values }) => {
                return {
                    url: `companies/${companyId}/external-service-settings/${type}/confirm-login`,
                    method: 'post',
                    data: values,
                };
            },
            transformResponse: (response: { data: CompanyExternalServiceSettings }) => response.data,
        }),
    }),
});

export const {
    useGetCompanyExternalServiceSettingsQuery,
    useCreateCompanyExternalServiceSettingsMutation,
    useCreateCompanyExternalServiceSettingsLoginMutation,
    useCreateCompanyExternalServiceSettingsConfirmLoginMutation,
} = companyExternalServiceSettingsApi;
