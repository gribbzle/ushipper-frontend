export const formatPermissions = (rolePermissions: Record<string, string[]>): Record<string, Record<string, boolean>> =>
    Object.keys(rolePermissions).reduce((formattedPermissions, permissionGroup) => {
        formattedPermissions[permissionGroup] = rolePermissions[permissionGroup].reduce((group, permission) => {
            group[permission.replaceAll('.', '/')] = true;

            return group;
        }, {} as Record<string, boolean>);

        return formattedPermissions;
    }, {} as Record<string, Record<string, boolean>>);

export const arePermissionsEqual = (permissions: Record<string, string[]>, rolePermissions: Record<string, string[]>): boolean =>
    Object.keys(permissions).every(group => {
        const permissionList = permissions[group];
        const rolePermissionList = rolePermissions[group] || [];

        return permissionList.length === rolePermissionList.length;
    });

export const areAllPermissionsSelected = (permissionState: Record<string, Record<string, boolean>>, rolePermissions: Record<string, string[]>): boolean =>
    Object.keys(rolePermissions).every(group => {
        return rolePermissions[group].every(permission => permissionState[group]?.[permission.replaceAll('.', '/')] === true);
    });

type PermissionsValues = Record<string, Record<string, boolean>> | Record<string, string[]>;

export const filterPermissions = <T extends PermissionsValues>(permissions: T, excludedPermissions: string[]): T => {
    if (!excludedPermissions.length) {
        return permissions;
    }

    return Object.keys(permissions).reduce((filtered, group) => {
        const groupPermissions = permissions[group];

        if (Array.isArray(groupPermissions)) {
            const filteredGroup = groupPermissions.filter(permission => !excludedPermissions.includes(permission));

            if (filteredGroup.length > 0) {
                (filtered as Record<string, string[]>)[group] = filteredGroup;
            }
        } else {
            const filteredGroup = Object.keys(groupPermissions)
                .filter(permission => !excludedPermissions.includes(permission.replaceAll('/', '.')))
                .reduce((acc, key) => {
                    acc[key] = groupPermissions[key];

                    return acc;
                }, {} as Record<string, boolean>);

            if (Object.keys(filteredGroup).length > 0) {
                (filtered as Record<string, Record<string, boolean>>)[group] = filteredGroup;
            }
        }

        return filtered;
    }, {} as T);
};
