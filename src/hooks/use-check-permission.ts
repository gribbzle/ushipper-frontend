import { useAppSelector } from '@store';
import { accountUsersSelector, permissionsSelector } from '@store/global';

export type Permission = {
    scope: string;
    functionality: string;
};

export const useCheckPermission = () => {
    const permissibility = useAppSelector(permissionsSelector);
    const accountUsers = useAppSelector(accountUsersSelector);

    return (permissions?: Permission[]) => {
        if (!permissions) {
            return true;
        }

        const hasGlobalPermission = (permission: Permission) => {
            if (!permissibility) {
                return false;
            }

            return permissibility[permission.scope]?.includes(permission.functionality);
        };

        const hasUserPermission = (permission: Permission) => {
            return accountUsers?.some(user => user.role?.permissions?.[permission.scope]?.includes(permission.functionality));
        };

        return permissions.some(permission => hasGlobalPermission(permission) || hasUserPermission(permission));
    };
};

export const useHasPermission = (permissions: Permission) => {
    const checkPermission = useCheckPermission();
    const hasPermission = checkPermission([permissions]);

    return hasPermission;
};
