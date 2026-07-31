type AppState = {
    common: {
        staff: any;
    };
};

const staffPageSelector = (state: AppState) => state.common.staff;

export const isCreateEditUserModalVisibleSelector = (state: AppState) => {
    const { createEditModal } = staffPageSelector(state);

    return createEditModal.isVisible;
};

export const createEditUserModalModeSelector = (state: AppState) => {
    const { createEditModal } = staffPageSelector(state);

    return createEditModal.mode;
};

export const usersFiltersSelector = (state: AppState) => {
    const { filters } = staffPageSelector(state);

    return filters;
};

export const userRolesSelector = (state: AppState) => {
    const { fetchUserRoles } = staffPageSelector(state);

    return fetchUserRoles.data;
};

export const fetchedUserSelector = (state: AppState) => {
    const { fetchUser } = staffPageSelector(state);

    return fetchUser.data;
};

export const deleteUserPopupPropsSelector = (state: AppState) => {
    const { deleteUserPopup } = staffPageSelector(state);

    return deleteUserPopup;
};

export const assignDrawerSelector = (state: AppState) => state.common.staff.assignDrawer;
