import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { companiesActions } from '@store/admin/companies/slice';

export const useOpenCreateCompanyDrawer = () => {
    const dispatch = useAppDispatch();

    const onOpenCreateCompanyDrawer = useCallback(() => {
        dispatch(
            companiesActions.setCreateEditCompanyDrawerProps({
                isVisible: true,
                mode: 'create',
                companyId: null,
            }),
        );
    }, [dispatch]);

    return { onOpenCreateCompanyDrawer };
};
