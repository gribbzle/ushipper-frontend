import { AppState } from "@store";

const rolesSettingsPageSelector = (state: AppState) => state.common.rolesSettings;

export const fetchedRolesSelector = (state: AppState) => {
    const { fetchRoles } = rolesSettingsPageSelector(state);

    return fetchRoles.data;
};

export const fetchedRolesRequestStatusSelector = (state: AppState) => {
    const { fetchRoles } = rolesSettingsPageSelector(state);

    return fetchRoles.status;
};

export const createUpdateRoleBlockPropsSelector = (state: AppState) => {
    const { createUpdateRoleBlock } = rolesSettingsPageSelector(state);

    return createUpdateRoleBlock;
};

export const roleTypesSelector = (state: AppState) => {
    const { fetchRoleTypes } = rolesSettingsPageSelector(state);

    return fetchRoleTypes.data;
};

export const fetchedRoleSelector = (state: AppState) => {
    const { fetchRole } = rolesSettingsPageSelector(state);

    return fetchRole.data;
};

export const fetchedRoleRequestStatusSelector = (state: AppState) => {
    const { fetchRole } = rolesSettingsPageSelector(state);

    return fetchRole.status;
};

export const deleteRolePopupPropsSelector = (state: AppState) => {
    const { deleteRolePopup } = rolesSettingsPageSelector(state);

    return deleteRolePopup;
};

export const clickedRowIdSelector = (state: AppState) => {
    const { clickedRowId } = rolesSettingsPageSelector(state);

    return clickedRowId;
};
