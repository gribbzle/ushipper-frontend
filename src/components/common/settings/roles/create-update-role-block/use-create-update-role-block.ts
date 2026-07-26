import { useCallback, useEffect, useMemo, useState } from 'react';
import { toCamelCase, toSnakeCase } from 'js-convert-case';

import { CreateUpdateRoleFormState } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetRolesQuery } from '@store/api/roles-api';
import {
    createUpdateRoleBlockPropsSelector,
    createUpdateRoleFormSubmit,
    fetchedRoleRequestStatusSelector,
    fetchedRoleSelector,
    fetchedRolesRequestStatusSelector,
    roleTypesSelector,
} from '@store/common';
import { rolesSettingsActions } from '@store/common/roles-settings/slice';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';
import { isFreightX, RequestStatus } from '@utils';

import { AdminRoleTypesMap, CarrierRoleTypesMap, ShipperRoleTypesMap } from './permissions-maps';
import { areAllPermissionsSelected, arePermissionsEqual, filterPermissions, formatPermissions } from './utils';

const excludedPermissionsForFreightX = [
    'admin_panel.accounting.cod_cop_orders',
    'admin_panel.settings.car_makers.view_any',
    'admin_panel.settings.cars_models.view_any',
];

export const excludedPermissions = isFreightX ? excludedPermissionsForFreightX : [];

export const useCreateUpdateRoleBlock = () => {
    const dispatch = useAppDispatch();

    const { mode } = useAppSelector(createUpdateRoleBlockPropsSelector);
    const roleTypes = useAppSelector(roleTypesSelector);
    const fetchedRole = useAppSelector(fetchedRoleSelector);
    const fetchedRoleRequestStatus = useAppSelector(fetchedRoleRequestStatusSelector);
    const fetchedRolesRequestStatus = useAppSelector(fetchedRolesRequestStatusSelector);
    const companyId = useAppSelector(authorizedUserCompanyPublicIdSelector);

    const [allowSubordinateUsers, setAllowSubordinateUsers] = useState<boolean>();
    const [isSelectedAllPermissions, setIsSelectedAllPermissions] = useState(false);
    const [selectedRoleType, setSelectedRoleType] = useState<string>();
    const [permissionState, setPermissionState] = useState<Record<string, Record<string, boolean>>>({});

    const { data: superiorRoles } = useGetRolesQuery({ superiorRoleId: fetchedRole?.id, companyId }, { skip: !fetchedRole });

    useEffect(() => {
        if (fetchedRole) {
            const { isSubordinationAllowed, type, permissions } = fetchedRole;

            setAllowSubordinateUsers(isSubordinationAllowed);

            if (roleTypes) {
                const rolePermissions = roleTypes?.[toCamelCase(type)];

                // setIsSelectedAllPermissions(arePermissionsEqual(permissions, rolePermissions));
                const filteredPermissions = filterPermissions(permissions, excludedPermissions);
                const filteredRolePermissions = filterPermissions(rolePermissions, excludedPermissions);

                // Сравниваем отфильтрованные пермишены
                setIsSelectedAllPermissions(arePermissionsEqual(filteredPermissions, filteredRolePermissions));
                setSelectedRoleType(type);
            }
        }
    }, [fetchedRole, roleTypes]);

    const onChangePermission = useCallback(
        (group: string, permissionName: string, val: boolean) => {
            const currentPermissions = {
                ...permissionState,
                [group]: {
                    ...(permissionState[group] || {}),
                    [permissionName]: val,
                },
            };

            setPermissionState(currentPermissions);
            const rolePermissions = roleTypes?.[toCamelCase(selectedRoleType || '')];

            if (rolePermissions) {
                const filteredRolePermissions = filterPermissions(rolePermissions, excludedPermissions);
                const allSelected = areAllPermissionsSelected(currentPermissions, filteredRolePermissions);

                // const allSelected = areAllPermissionsSelected(currentPermissions, rolePermissions);

                setIsSelectedAllPermissions(allSelected);
            }
        },
        [permissionState, selectedRoleType, roleTypes],
    );

    const onSubmit = useCallback(
        (values: CreateUpdateRoleFormState) => {
            const { roleType, ...others } = values;
            const subordinateRoleIds = (values.subordinateRoleIds || []).map(roleOption => roleOption.value);
            const isSubordinationAllowed = allowSubordinateUsers;

            // const formattedPermissions: any = { ...permissionState };

            const filteredPermissionState = filterPermissions(permissionState, excludedPermissions);

            const formattedPermissions: any = { ...filteredPermissionState };

            Object.keys(formattedPermissions).forEach(permissionGroup => {
                const groupPermissions = formattedPermissions[permissionGroup];

                formattedPermissions[permissionGroup] = Object.keys(groupPermissions)
                    .filter(key => !!groupPermissions[key])
                    .map(permission => permission.replaceAll('/', '.'));
            });

            dispatch(createUpdateRoleFormSubmit({ ...others, permissions: formattedPermissions, roleType, subordinateRoleIds, isSubordinationAllowed }));
        },
        [allowSubordinateUsers, dispatch, permissionState],
    );

    const userRolesOptions = useMemo(
        () =>
            roleTypes
                ? Object.keys(roleTypes)
                      .filter(roleType => {
                          const fetchedRoleIncludesOwner = fetchedRole?.name.toLowerCase().includes('owner');

                          if (mode === 'create' || !fetchedRoleIncludesOwner) {
                              return !roleType.toLowerCase().includes('owner');
                          }

                          return true;
                      })
                      .map(type => ({
                          value: toSnakeCase(type),
                          label: CarrierRoleTypesMap[type] || AdminRoleTypesMap[type] || ShipperRoleTypesMap[type] || type,
                      }))
                : [],
        [mode, roleTypes, fetchedRole?.name],
    );

    const initialValues = useMemo(() => {
        if (!fetchedRole || mode === 'create') {
            return {
                name: '',
                roleType: null,
            };
        }

        const { name, type, permissions } = fetchedRole;
        // const formattedPermissions = { ...permissions };

        // setPermissionState(formatPermissions(formattedPermissions));
        const filteredPermissions = filterPermissions(formatPermissions(permissions), excludedPermissions);

        setPermissionState(filteredPermissions);

        return {
            name,
            roleType: type,
            subordinateRoleIds: superiorRoles?.map(role => ({ label: role.name, value: role.id })),
        };
    }, [fetchedRole, mode, superiorRoles]);

    const onDeleteClickHandler = useCallback(() => {
        if (fetchedRole) {
            dispatch(
                rolesSettingsActions.setDeleteRolePopupProps({
                    isVisible: true,
                    roleId: fetchedRole.id,
                    roleName: fetchedRole.name,
                }),
            );
        }
    }, [dispatch, fetchedRole]);

    const handleChangeSubordinateUsers = useCallback((value: boolean) => setAllowSubordinateUsers(value), []);

    const handleSelectAllChange = useCallback((permissions: Record<string, Record<string, boolean>>, checked: boolean) => {
        setPermissionState(permissions);
        setIsSelectedAllPermissions(checked);
    }, []);

    const showLoader = useMemo(() => {
        const checkedStatuses = [RequestStatus.PROCESSING, RequestStatus.NONE];

        return checkedStatuses.includes(fetchedRoleRequestStatus) || checkedStatuses.includes(fetchedRolesRequestStatus);
    }, [fetchedRoleRequestStatus, fetchedRolesRequestStatus]);

    return {
        roleTypes,
        fetchedRole,
        mode,
        showLoader,
        initialValues,
        userRolesOptions,
        isSelectedAllPermissions,
        selectedRoleType,
        allowSubordinateUsers,
        permissionState,
        setPermissionState,
        setSelectedRoleType,
        setIsSelectedAllPermissions,
        handleSelectAllChange,
        handleChangeSubordinateUsers,
        onDeleteClickHandler,
        onChangePermission,
        onSubmit,
    };
};
