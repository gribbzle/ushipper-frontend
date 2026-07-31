import { RequestWithStatus } from '@utils/redux';

export type Contact = {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    zip: string;
    contactName: string;
    internalNotes: string;
    createdAt: string;
    updatedAt: string;
    companyName: string;
};

export type ContactsFilters = {
    search: string | null;
    orderName: string | null;
    orderDirection: string | null;
    page: number;
    perPage: number;
    lastPage: number | null;
    to?: number;
    from?: number;
    total?: number;
};

export type FetchedContacts = {
    data: Contact[];
    lastPage: number;
    to: number;
    from: number;
    total: number;
};

export type CreateEditContactModalState = {
    isVisible: boolean;
    mode: 'create' | 'edit' | null;
    contactId: number | null;
};

export type DeleteContactPopupState = {
    isVisible: boolean;
    contactId: number | null;
    contactName: string | null;
};

export type ContactsSliceState = {
    fetchContacts: RequestWithStatus<FetchedContacts>;

    createEditContactFormSubmit: RequestWithStatus<any>;
    filters: ContactsFilters;

    fetchContact: RequestWithStatus<Contact>;
    createEditModal: CreateEditContactModalState;

    deleteContactPopup: DeleteContactPopupState;
    deleteContact: RequestWithStatus<any>;
};

export type CreateEditContactData = {
    id?: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    contactName: string;
    phone: string;
    email: string;
    internalNotes: string;
};
