import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { companiesActions } from '@store/admin/companies/slice';

export const useOpenDeleteCompanyPopup = () => {
    const dispatch = useAppDispatch();

    const onOpenDeleteCompanyPopup = useCallback(
        ({ companyId, companyName }: { companyId: string; companyName: string }) => {
            dispatch(companiesActions.setDeleteCompanyPopupProps({ isVisible: true, companyId, companyName }));
        },
        [dispatch],
    );

    return onOpenDeleteCompanyPopup;
};
