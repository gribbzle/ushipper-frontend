import { toSnakeCase } from 'js-convert-case';

import { axios } from '@utils/axios';

import { CreateEditUserData } from '../store/common/staff/types';

export const createEditUser = async (mode: 'create' | 'edit', user: CreateEditUserData, isAvatarDeleted: boolean) => {
    const formData = new FormData();

    let key: keyof typeof user;

    for (key in user) {
        if (key != 'avatar' || (key === 'avatar' && user[key] instanceof File)) {
            formData.append(toSnakeCase(key), user[key] as string | Blob);
        }
    }

    if (mode === 'edit') {
        if (isAvatarDeleted) {
            formData.append('avatar', '');
        }
    }

    const result = await axios({
        url: mode === 'create' ? '/api/users' : `/api/users/${user.publicId}`,
        method: mode === 'create' ? 'POST' : 'PATCH',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result.data;
};

export const fetchUser = async (userPublicId: string) => {
    const result = await axios.get(`/api/users/${userPublicId}`);

    return result.data.data;
};

export const deleteUser = async (userPublicId: string) => {
    const result = await axios.delete(`/api/users/${userPublicId}`);

    return result.data;
};
