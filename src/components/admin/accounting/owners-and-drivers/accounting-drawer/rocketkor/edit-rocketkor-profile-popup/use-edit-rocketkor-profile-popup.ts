import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, isCreateAccountingProfileLoadingSelector, isEditRocketkorSelector } from '@store/admin';

import { useRocketkorForm } from '../rocketkor-form/use-rocketkor-form';

export const useEditRocketkorProfilePopup = () => {
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(isCreateAccountingProfileLoadingSelector);
    const isEditRocketkor = useAppSelector(isEditRocketkorSelector);
    const { rocketkorFormId } = useRocketkorForm();

    const handleClosePopup = useCallback(async () => dispatch(accountingActions.setIsEditRocketkor(false)), [dispatch]);

    return {
        isPopupOpened: isEditRocketkor,
        isLoading,
        rocketkorFormId,
        handleClosePopup,
    };
};
