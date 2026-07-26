import { MouseEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import { CompanyType } from '@/enums';
import { useAppDispatch } from '@store';
import { apiSlice } from '@store/api/api-slice';
import { useCreateUserFlagMutation, useDeleteUserFlagMutation } from '@store/api/users-api';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:catalogs.notifications');

export const useDispatcherItemBody = (publicId?: string) => {
    const dispatch = useAppDispatch();
    const [createUserFlag] = useCreateUserFlagMutation();
    const [deleteUserFlag] = useDeleteUserFlagMutation();

    const handleFlaggedClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (publicId) {
                createUserFlag({ publicId })
                    .unwrap()
                    .then(() => {
                        dispatch(
                            apiSlice.util.invalidateTags([{ type: 'Dispatchers', id: 'LIST' }, { type: 'DispatchersStats' }, { type: 'Users', id: publicId }]),
                        );
                        toast.success(t<string>('flagged-success-notification', { companyType: CompanyType.DISPATCHER }));
                    })
                    .catch(() => {
                        toast.error(t<string>('update-error-notification', { companyType: CompanyType.DISPATCHER }));
                    });
            }
        },
        [createUserFlag, dispatch, publicId],
    );

    const handleUnFlaggedClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (publicId) {
                deleteUserFlag({ publicId })
                    .unwrap()
                    .then(() => {
                        dispatch(
                            apiSlice.util.invalidateTags([{ type: 'DispatchersStats' }, { type: 'Dispatchers', id: 'LIST' }, { type: 'Users', id: publicId }]),
                        );
                        toast.success(t<string>('unflagged-success-notification', { companyType: CompanyType.DISPATCHER }));
                    })
                    .catch(() => {
                        toast.error(t<string>('update-stats-error-notification', { companyType: CompanyType.DISPATCHER }));
                    });
            }
        },
        [deleteUserFlag, dispatch, publicId],
    );

    return { handleUnFlaggedClick, handleFlaggedClick };
};
