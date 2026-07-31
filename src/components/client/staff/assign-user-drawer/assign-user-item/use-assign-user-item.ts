import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { BackError, processError } from '@/utils/process-error';
import { useAppDispatch, useAppSelector } from '@store';
import { apiSlice } from '@store/api/api-slice';
import { useUpdateUserJSONMutation } from '@store/api/users-api';
import { assignDrawerSelector } from '@store/common';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('common:staff-table');

export const useAssignUserItem = (publicId: string, assigned?: boolean) => {
    const dispatch = useAppDispatch();
    const { superiorUserPublicId } = useAppSelector(assignDrawerSelector);
    const [updateUser] = useUpdateUserJSONMutation();

    const handleClick = useCallback(async () => {
        try {
            await updateUser({ superiorUserPublicId: assigned ? '' : String(superiorUserPublicId), publicId }).unwrap();
            dispatch(apiSlice.util.invalidateTags([{ type: 'Users', id: 'LIST' }]));
            toast.success(t<string>(assigned ? 'unassign-success' : 'assign-success'));
        } catch (error) {
            processError(error as BackError);
        }
    }, [updateUser, assigned, superiorUserPublicId, publicId, dispatch]);

    return {
        handleClick,
    };
};
