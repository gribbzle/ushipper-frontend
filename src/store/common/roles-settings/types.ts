import { ClickedRowId } from '@components';
import { Permissions } from '@store/global/types';
import { RequestWithStatus } from '@utils';

import { UserRole } from '../staff';

export type RolesSettingsSliceState = {
    fetchRoles: RequestWithStatus<UserRole[]>;

    createUpdateRoleBlock: CreateUpdateRoleBlockState;
    fetchRoleTypes: RequestWithStatus<RoleTypes>;
    createUpdateRoleFormSubmit: RequestWithStatus<any>;
    fetchRole: RequestWithStatus<any>;

    deleteRolePopup: DeleteRolePopupState;
    deleteRole: RequestWithStatus<any>;

    clickedRowId: ClickedRowId;
};

export type RoleTypes = {
    [key: string]: Permissions;
};

export type CreateUpdateRoleBlockState = {
    mode: 'create' | 'edit';
    roleId: number | null;
};

export type DeleteRolePopupState = {
    isVisible: boolean;
    roleId: number | null;
    roleName: string | null;
};
