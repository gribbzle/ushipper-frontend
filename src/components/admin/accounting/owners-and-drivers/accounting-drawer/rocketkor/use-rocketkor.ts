import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, accountingDrawerPropsSelector } from '@store/admin';

import { useGetAccountingProfile } from '../hooks/use-get-accounting-profile';

export const useRocketkor = () => {
    const dispatch = useAppDispatch();
    const { isRocketkorFormVisible } = useAppSelector(accountingDrawerPropsSelector);

    const { accountingProfile, isLoading } = useGetAccountingProfile();

    const handleEdit = useCallback(() => dispatch(accountingActions.setIsEditRocketkor(true)), [dispatch]);

    const handleCloseForm = useCallback(
        () =>
            dispatch(
                accountingActions.setAccountingDrawerProps({
                    isRocketkorFormVisible: false,
                }),
            ),
        [dispatch],
    );

    const handleOpenForm = useCallback(
        () =>
            dispatch(
                accountingActions.setAccountingDrawerProps({
                    isRocketkorFormVisible: true,
                }),
            ),
        [dispatch],
    );

    return {
        isLoading,
        isRocketkorFormVisible,
        accountingProfile,
        handleEdit,
        handleCloseForm,
        handleOpenForm,
    };
};
