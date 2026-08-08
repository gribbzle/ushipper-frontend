import { AppState } from "@store";

export const blackListPageSelector = (state: AppState) => state.common.blackList;

export const fetchedBlackListItemsSelector = (state: AppState) => {
    const { fetchBlackListItems } = blackListPageSelector(state);

    return fetchBlackListItems.data?.data ?? [];
};

export const isCreateEditBlackListItemModalVisibleSelector = (state: AppState) => {
    const { createEditModal } = blackListPageSelector(state);

    return createEditModal.isVisible;
};

export const createEditBlackListItemModalModeSelector = (state: AppState) => {
    const { createEditModal } = blackListPageSelector(state);

    return createEditModal.mode;
};

export const blackListItemsFiltersSelector = (state: AppState) => {
    const { filters } = blackListPageSelector(state);

    return filters;
};

export const fetchedBlackListItemSelector = (state: AppState) => {
    const { fetchBlackListItem } = blackListPageSelector(state);

    return fetchBlackListItem.data;
};

export const deleteBlackListItemPopupPropsSelector = (state: AppState) => {
    const { deleteBlackListItemPopup } = blackListPageSelector(state);

    return deleteBlackListItemPopup;
};
