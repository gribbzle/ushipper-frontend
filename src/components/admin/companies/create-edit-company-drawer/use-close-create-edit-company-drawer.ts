import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { companiesActions } from '@store/admin/companies/slice';

export const useCloseCreateEditCompanyDrawer = () => {
    const dispatch = useAppDispatch();

    const onCloseHandler = useCallback(() => {
        dispatch(
            companiesActions.setCreateEditCompanyDrawerProps({
                isVisible: false,
                mode: null,
                companyId: null,
            }),
        );
    }, [dispatch]);

    return { onCloseHandler };
};
