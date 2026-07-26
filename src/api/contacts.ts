import { toSnakeCase } from 'js-convert-case';

import { ContactsFilters, CreateEditContactData, FetchedContacts } from '@store/client';
import { axios } from '@utils';

export const fetchContacts = async (filters: ContactsFilters) => {
    const result = await axios.get('/api/contacts', { params: filters });

    return result.data.data as FetchedContacts;
};

export const fetchContact = async (contactId: number) => {
    const result = await axios.get(`/api/contacts/${contactId}`);

    return result.data.data;
};

export const deleteContact = async (contactId: number) => {
    const result = await axios.delete(`/api/contacts/${contactId}`);

    return result.data;
};

export const createEditContact = async (mode: 'create' | 'edit', contact: CreateEditContactData) => {
    const formData = new FormData();
    let key: keyof typeof contact;

    for (key in contact) {
        if (contact[key] !== undefined && contact[key] !== null) {
            formData.append(toSnakeCase(key), contact[key] as string);
        }
    }

    if (mode === 'edit') {
        formData.append('_method', 'PATCH');
    }

    const result = await axios({
        url: mode === 'create' ? '/api/contacts' : `/api/contacts/${contact.id}`,
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result.data;
};
