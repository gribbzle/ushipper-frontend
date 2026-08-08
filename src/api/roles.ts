import { axios } from '@utils/axios';

import { UserRole } from '../store/common/staff/types';

export const fetchRoles = async (companyPublicId?: string) => {
    const result = await axios.get('/api/roles', {
        params: {
            companyId: companyPublicId,
        },
    });

    return result.data.data as UserRole[];
};

export const fetchRole = async (roleId: number) => {
    const result = await axios.get(`/api/roles/${roleId}`);

    return result.data.data as UserRole;
};

export const fetchRoleTypes = async () => {
    const result = await axios.get('/api/role-types');

    return result.data.data;
};

export const createUpdateRole = async (mode: 'create' | 'edit', role: any) => {
    const result = await axios({
        url: mode === 'create' ? '/api/roles' : `/api/roles/${role.id}`,
        method: mode === 'create' ? 'POST' : 'PATCH',
        data: role,
    });

    return result.data;
};

export const deleteRole = async (roleId: number) => {
    const result = await axios.delete(`/api/roles/${roleId}`);

    return result.data.data;
};
