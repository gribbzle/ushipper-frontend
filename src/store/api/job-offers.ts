import { toSnakeCase } from 'js-convert-case';

import { JobOffersFiltersParams, JobOfferStatisticsCounters } from '@/components/client/job-offers/job-offers-filters/job-offers-filters.types';
import { SendJobOfferFormValue } from '@/components/client/job-offers/send-job-offer-drawer/send-job-offer-form/send-job-offer-form.types';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { Attachment } from '@/shared';
import { apiSlice } from '@store/api/api-slice';
import { JobOffer } from '@store/client/job-offers/types';
import { PaginatedResponse } from '@utils/redux';

type CreateJobOfferDto = SendJobOfferFormValue & {
    receiverId?: string;
    offeringCompanyId?: string;
};

type UpdateJObOfferDto = SendJobOfferFormValue & {
    status: OfferStatusesEnum;
    declineReasons: ('low_salary' | 'personal_reason')[];
    declineComment: string | null;
};

const createJobOfferFormData = (offerInfo: Record<string, any>, attachments?: (File | Attachment)[]): FormData => {
    const formData = new FormData();

    if (attachments) {
        attachments.forEach(item => {
            if (item instanceof File) {
                formData.append('attachments[]', item);
            } else {
                formData.append('attachments[]', JSON.stringify(item));
            }
        });
    }

    Object.keys(offerInfo).forEach(key => {
        const fieldName = key as keyof typeof offerInfo;

        formData.append(toSnakeCase(key), String(offerInfo[fieldName]));
    });

    return formData;
};

export const jobOffersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getJobOffers: builder.query<
            PaginatedResponse<JobOffer[]>,
            {
                page: number;
                perPage: number;
            } & JobOffersFiltersParams
        >({
            query: params => ({
                url: 'job-offers',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<JobOffer[]> }) => response.data,
            providesTags: [{ type: 'JobOffers', id: 'LIST' }],
        }),
        getJobOffer: builder.query<JobOffer, string>({
            query: id => ({
                url: `job-offers/${id}`,
                method: 'get',
            }),
            transformResponse: (response: { data: JobOffer }) => response.data,
            providesTags: result => [{ type: 'JobOffers', id: result?.publicId }],
        }),
        getJobOffersStatistic: builder.query<JobOfferStatisticsCounters, JobOffersFiltersParams>({
            query: params => ({
                url: 'job-offers/statistics/counters',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: JobOfferStatisticsCounters }) => response.data,
            providesTags: [{ type: 'JobOffersStats' }],
        }),
        createJobOffer: builder.mutation<unknown, CreateJobOfferDto>({
            query: ({ attachments, ...offerInfo }) => {
                const formData = createJobOfferFormData(offerInfo, attachments);

                return {
                    url: 'job-offers',
                    method: 'post',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    formData: true,
                };
            },
        }),
        partiallyUpdateJobOffer: builder.mutation<JobOffer, { publicOfferId: string; jobOfferData: Partial<UpdateJObOfferDto> }>({
            query: ({ publicOfferId, jobOfferData: { attachments, ...offerInfo } }) => {
                const formData = createJobOfferFormData(offerInfo, attachments);

                return {
                    url: `job-offers/${publicOfferId}`,
                    method: 'patch',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    formData: true,
                };
            },
            invalidatesTags: result => [{ type: 'JobOffers', id: 'LIST' }, { type: 'JobOffersStats' }, { type: 'JobOffers', id: result?.publicId }],
        }),
    }),
});

export const { useGetJobOffersQuery, useGetJobOfferQuery, useGetJobOffersStatisticQuery, useCreateJobOfferMutation, usePartiallyUpdateJobOfferMutation } =
    jobOffersApi;
