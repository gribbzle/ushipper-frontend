import { OrderSortingDirection } from '@/enums';
import { PaginatedData } from '@utils/redux';

import { apiSlice } from './api-slice';

export type DetailedContact = Contact & {
    city: string;
    contactName: string;
    internalNotes: string;
    state: string;
    zip: string;
};

export type Contact = {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt: string;
    updatedAt: string;
};

type ContactsFilters = Partial<{
    search: string;
    orderName: string;
    orderDirection: OrderSortingDirection;
    page: number;
    perPage: number;
}>;

const defaultFilters: ContactsFilters = {
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
    page: 1,
    perPage: 20,
};

const contactsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getContactsByName: builder.query<Contact[], string | null>({
            query: contactName => {
                const params: ContactsFilters = {
                    ...defaultFilters,
                    search: contactName || undefined,
                };

                return {
                    url: 'contacts',
                    method: 'get',
                    params,
                };
            },
            transformResponse: (response: { data: PaginatedData<Contact[]> }) => response.data.data,
        }),
        getContactById: builder.query<DetailedContact, number>({
            query: contactId => ({
                url: `contacts/${contactId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: DetailedContact }) => response.data,
        }),
    }),
});

export const { useGetContactsByNameQuery, useLazyGetContactByIdQuery } = contactsApi;
