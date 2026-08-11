import { AppState } from "@store";

const EMPTY_ARRAY: any[] = [];
const contactsPageSelector = (state: AppState) => state.common.contacts;

export const isCreateEditContactModalVisibleSelector = (state: AppState) => {
    const { createEditModal } = contactsPageSelector(state);

    return createEditModal.isVisible;
};

export const createEditContactModalModeSelector = (state: AppState) => {
    const { createEditModal } = contactsPageSelector(state);

    return createEditModal.mode;
};

export const fetchedContactSelector = (state: AppState) => {
    const { fetchContact } = contactsPageSelector(state);

    return fetchContact.data;
};

export const contactsFiltersSelector = (state: AppState) => {
    const { filters } = contactsPageSelector(state);

    return filters;
};

export const fetchedContactsSelector = (state: AppState) => {
    const { fetchContacts } = contactsPageSelector(state);

    return fetchContacts.data?.data ?? EMPTY_ARRAY;
};

export const fetchedContactsStatusSelector = (state: AppState) => {
    const { fetchContacts } = contactsPageSelector(state);

    return fetchContacts.status;
};

export const deleteContactPopupPropsSelector = (state: AppState) => {
    const { deleteContactPopup } = contactsPageSelector(state);

    return deleteContactPopup;
};
