import React, { useCallback, useMemo } from 'react';
import { toCamelCase } from 'js-convert-case';

import { UserRoleType } from '@/enums';
import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { FormControl } from '@fields';
import { useAppSelector } from '@store';
import { roleTypesSelector } from '@store/common';
import { translateByNamespace } from '@utils/i18n';

import { excludedPermissions } from '../use-create-update-role-block';
import { filterPermissions, formatPermissions } from '../utils';

type Props = {
    callback: (val: Record<string, Record<string, boolean>>, checked: boolean) => void;
    selectedRoleType?: string;
    checked: boolean;
};

const t = translateByNamespace('common:create-update-role-block:form');

export const SelectAllPermissionsSwitch = ({ callback, checked, selectedRoleType }: Props) => {
    const roleTypes = useAppSelector(roleTypesSelector);

    const isDisabled = useMemo(
        () => (selectedRoleType ? [UserRoleType.CARRIER_OWNER, UserRoleType.SHIPPER_OWNER].includes(selectedRoleType as UserRoleType) : false),
        [selectedRoleType],
    );

    const handleSelectAllPermissionsChange = useCallback(
        (checked: boolean) => {
            if (checked && selectedRoleType) {
                const rolePermissions = roleTypes?.[toCamelCase(selectedRoleType)];

                if (rolePermissions) {
                    const filteredRolePermissions = filterPermissions(rolePermissions ?? {}, excludedPermissions);

                    callback(formatPermissions(filteredRolePermissions), checked);

                    // callback(formatPermissions(rolePermissions), checked);
                }
            } else {
                callback({}, false);
            }
        },
        [roleTypes, selectedRoleType, callback],
    );

    return (
        <FormControl>
            <NativeSwitch checked={checked} onChange={handleSelectAllPermissionsChange} label={t('select-all-label')} disabled={isDisabled} />
        </FormControl>
    );
};
