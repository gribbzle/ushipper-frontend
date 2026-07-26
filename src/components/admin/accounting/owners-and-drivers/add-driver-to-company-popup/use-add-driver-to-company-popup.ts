import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, addDriverToCompanyPopupPropsSelector } from '@store/admin';

import { AddDriverToCompanyFormState } from './add-driver-to-company-form';

export const useAddDriverToCompanyPopup = () => {
    const { isPopupOpened, name } = useAppSelector(addDriverToCompanyPopupPropsSelector);
    const formRef = useRef<FormApi<AddDriverToCompanyFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleClosePopup = useCallback(
        () => dispatch(accountingActions.setAddDriverToCompanyPopupProps({ isPopupOpened: false, name: null, email: null })),
        [dispatch],
    );

    return {
        formRef,
        isPopupOpened,
        name,
        handleSubmitClick,
        handleClosePopup,
    };
};
