import { CompanyType } from '@/enums';
import { Company } from '@store/admin';
import { apiSlice } from '@store/api/api-slice';
import { GenericSpecialization, PaginatedResponse } from '@utils';

export type CompanyPathData = Partial<
    Omit<Company, 'logo' | 'birthYear' | 'specializations' | 'businessHours'> & {
        logo: string | File;
        birthYear: number | null;
        specializations: GenericSpecialization[];
        businessHours: string | null;
    }
>;

export type CompanyContactPathData = Partial<{
    names: string | null;
    phones: string | null;
    emails: string | null;
}>;

type PerCentage = number; // float, max 100, min 0
type Rating = number; // float, max 5, min 0
type ReviewsTotal = number; // float,  min 0

type ScoreDetail = {
    rating: Rating;
    count: number;
    percentage: PerCentage;
};

type AverageItem = {
    title: string;
    rating: Rating;
};

export type CompanyTotalRating = {
    rating: Rating;
    reviewsTotal: ReviewsTotal;
    perScore: ScoreDetail[];
    itemsAvg: AverageItem[];
};

export type CompanyFMCSAAddressInfo = {
    addressCity: string | null;
    addressCountry: string | null;
    addressState: string | null;
    addressStreet: string | null;
    addressZipcode: string | null;
};

export type CompanyFMCSATotalInfo = {
    allowedToOperate: boolean;
    legalName: string | null;
    ein: string | null;
    totalDrivers: number | null;
    totalPowerUnits: number | null;
};

export type CompanyFMCSAInsuranceInfo = {
    insuranceBipdRequired: boolean;
    insuranceBipdOnfile: number;
    insuranceBipdRequiredAmount: number;
    insuranceBondRequired: boolean;
    insuranceBondOnfile: number;
    insuranceBondRequiredAmount: number;
    insuranceCargoRequired: boolean;
    insuranceCargoOnfile: number;
    insuranceCargoRequiredAmount: number;
};

export type CompanyFMCSACrashesInfo = {
    crashesTotal: number | null;
    crashesTowaway: number | null;
    crashesFatal: number | null;
    crashesInjury: number | null;
};

export type CompanyFMCSAAuthorizedInfo = {
    authorityBroker: boolean;
    authorityCommon: boolean;
    authorityContract: boolean;
    authorizedForBroker: boolean;
    authorizedForGoods: boolean;
    authorizedForPassenger: boolean;
    authorizedForProperty: boolean;
};

export type CompanyFMCSARecord = CompanyFMCSAAddressInfo &
    CompanyFMCSATotalInfo &
    CompanyFMCSAInsuranceInfo &
    CompanyFMCSACrashesInfo &
    CompanyFMCSAAuthorizedInfo & {
        oosDate: string | null;
        docketPrefix: string | null;
        docketNumber: string | null;
        createdAt: string;
        canBeRefreshed: boolean;
    };

export type GetCompaniesParams = {
    name?: string;
    type?: CompanyType;
    publicIds?: string[];
    isPartner?: number;
    cursor?: string;
    perPage?: number;
};

export const companyApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCompanies: builder.query<PaginatedResponse<Company[]>, GetCompaniesParams>({
            query: params => ({
                url: 'companies',
                method: 'GET',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<Company[]> }) => response.data,
            providesTags: [{ type: 'Companies', id: 'LIST' }],
        }),
        getCompany: builder.query<Company, string>({
            query: companyId => ({
                url: `companies/${companyId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: Company }) => response.data,
        }),
        patchCompany: builder.mutation<Company, { companyId: string; data: CompanyPathData }>({
            query: ({ companyId, data }) => {
                console.log(data, 2);

                return {
                    url: `companies/${companyId}`,
                    method: 'patch',
                    headers: {
                        'Content-Type': 'multipart/form-data;',
                    },
                    data,
                    formData: true,
                };
            },
        }),
        pathCompanyContact: builder.mutation<Company, { companyId: string; data: CompanyContactPathData }>({
            query: ({ companyId, data }) => {
                return {
                    url: `companies/${companyId}/contact`,
                    method: 'patch',
                    data,
                };
            },
        }),
        pathCompanyJSON: builder.mutation<Company, { companyId: string; data: CompanyPathData }>({
            query: ({ companyId, data }) => ({
                url: `companies/${companyId}`,
                method: 'patch',
                data,
            }),
            transformResponse: (response: { data: Company }) => response.data,
        }),
        getCompanyRating: builder.query<CompanyTotalRating, string>({
            query: companyId => {
                return {
                    url: `companies/${companyId}/rating`,
                    method: 'get',
                };
            },
            transformResponse: (response: { data: CompanyTotalRating }) => response.data,
        }),
        getCompanyFMCSARecord: builder.query<CompanyFMCSARecord, { companyId: string }>({
            query: ({ companyId }) => ({
                url: `companies/${companyId}/fmcsa-record`,
                method: 'get',
            }),
            transformResponse: (response: { data: CompanyFMCSARecord }) => response.data,
        }),
        updateCompanyFMCSARecord: builder.mutation<CompanyFMCSARecord, string>({
            query: companyId => ({
                url: `companies/${companyId}/fmcsa-record/refresh-requests`,
                method: 'post',
            }),
            transformResponse: (response: { data: CompanyFMCSARecord }) => response.data,
        }),
        createCompanyFlag: builder.mutation<void, { companyPublicId: string }>({
            query: ({ companyPublicId }) => ({
                url: `companies/${companyPublicId}/flag`,
                method: 'post',
            }),
        }),
        deleteCompanyFlag: builder.mutation<void, { companyPublicId: string }>({
            query: ({ companyPublicId }) => ({
                url: `companies/${companyPublicId}/flag`,
                method: 'delete',
            }),
        }),
    }),
});

export const {
    useGetCompanyQuery,
    useLazyGetCompanyQuery,
    usePatchCompanyMutation,
    usePathCompanyContactMutation,
    usePathCompanyJSONMutation,
    useGetCompaniesQuery,
    useLazyGetCompaniesQuery,
    useGetCompanyFMCSARecordQuery,
    useUpdateCompanyFMCSARecordMutation,
    useGetCompanyRatingQuery,
    useCreateCompanyFlagMutation,
    useDeleteCompanyFlagMutation,
} = companyApi;
