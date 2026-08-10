import React, { useMemo } from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {SelectField} from '@/fields/select-field';
import { useAppSelector } from '@store';
import { useGetRolesQuery } from '@store/api/roles-api';
import { clickedRowIdSelector } from '@store/common';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';

export const RolesSelect = ({ label, input, ...rest }: FieldRenderProps<string>) => {
    const clickedRowId = useAppSelector(clickedRowIdSelector);
    const companyId = useAppSelector(authorizedUserCompanyPublicIdSelector);
    const { data: userRoles = [], isLoading } = useGetRolesQuery({ companyId, subordinationPossibleForRoleId: String(clickedRowId ?? '') });
    const userRoleOptions = useMemo(() => userRoles?.map(role => ({ label: role.name, value: role.id })), [userRoles]);

    return (
        <FormControl>
            <InputLabel required={rest.required}>{label}</InputLabel>
            <Field label={label} component={SelectField} name={input.name} options={userRoleOptions} input={input} {...rest} isLoading={isLoading} />
        </FormControl>
    );
};
