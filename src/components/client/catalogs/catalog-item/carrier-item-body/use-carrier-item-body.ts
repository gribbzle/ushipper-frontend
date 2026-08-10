import { MouseEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import { CompanyType } from '@/enums/company-type';
import { useAppDispatch } from '@store';
import { apiSlice } from '@store/api/api-slice';
import { useCreateCompanyFlagMutation, useDeleteCompanyFlagMutation } from '@store/api/company-api';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:catalogs.notifications');

export const useCarrierItemBody = (publicId?: string) => {
    const dispatch = useAppDispatch();
    const [createCompanyFlag] = useCreateCompanyFlagMutation();
    const [deleteCompanyFlag] = useDeleteCompanyFlagMutation();

    const handleFlaggedClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (publicId) {
                createCompanyFlag({ companyPublicId: publicId })
                    .unwrap()
                    .then(() => {
                        dispatch(apiSlice.util.invalidateTags([{ type: 'CarriersStats' }, { type: 'Carriers', id: 'LIST' }]));
                        toast.success(t<string>('flagged-success-notification', { companyType: CompanyType.CARRIER }));
                    })
                    .catch(() => {
                        toast.error(t<string>('update-error-notification', { companyType: CompanyType.CARRIER }));
                    });
            }
        },
        [createCompanyFlag, dispatch, publicId],
    );

    const handleUnFlaggedClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (publicId) {
                deleteCompanyFlag({ companyPublicId: publicId })
                    .unwrap()
                    .then(() => {
                        dispatch(apiSlice.util.invalidateTags([{ type: 'CarriersStats' }, { type: 'Carriers', id: 'LIST' }]));
                        toast.success(t<string>('unflagged-success-notification', { companyType: CompanyType.CARRIER }));
                    })
                    .catch(() => {
                        toast.error(t<string>('update-error-notification', { companyType: CompanyType.CARRIER }));
                    });
            }
        },
        [deleteCompanyFlag, dispatch, publicId],
    );

    return { handleUnFlaggedClick, handleFlaggedClick };
};
