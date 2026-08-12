import { apiSlice } from './api-slice';

export type Language = {
    title: string;
    code: string;
};

const languagesApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getLanguages: builder.query<Language[], void>({
            query: () => ({
                url: 'languages',
                method: 'get',
            }),
            transformResponse: (response: { data: { data: Language[] } }) => response.data.data,
        }),
    }),
});

export const { useGetLanguagesQuery } = languagesApi;
