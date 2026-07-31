import { ClickedRowId } from '@components/common/table/table.types';
import { Permissions } from '@store/global/shared-types';
import { RequestWithStatus } from '@utils/redux';

import { UserRole } from '../staff/types';

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
