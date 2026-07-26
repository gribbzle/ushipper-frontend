import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { editFuelCardPopupPropsSelector, fuelActions } from '@store/admin';

import { EditFuelCardFormState } from './edit-fuel-card-form';

export const useEditFuelCardPopup = () => {
    const { fuelCard, isPopupOpened, isLoading } = useAppSelector(editFuelCardPopupPropsSelector);
    const formRef = useRef<FormApi<EditFuelCardFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleClosePopup = useCallback(
        () =>
            dispatch(
                fuelActions.setEditFuelCardPopupProps({
                    isPopupOpened: false,
                    fuelCard: null,
                    isLoading: false,
                }),
            ),
        [dispatch],
    );

    return {
        formRef,
        isPopupOpened,
        isLoading,
        fuelCard,
        handleSubmitClick,
        handleClosePopup,
    };
};
