import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { addFuelCardToDriverPopupPropsSelector, fuelActions } from '@store/admin';

import { AddFuelCardToDriverFormState } from './add-fuel-card-to-driver-form';

export const useAddFuelCardToDriverPopup = () => {
    const { fuelCard, isPopupOpened } = useAppSelector(addFuelCardToDriverPopupPropsSelector);
    const formRef = useRef<FormApi<AddFuelCardToDriverFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleClosePopup = useCallback(() => dispatch(fuelActions.setFuelCardToDriverPopupProps({ isPopupOpened: false, fuelCard: null })), [dispatch]);

    return {
        formRef,
        isPopupOpened,
        fuelCard,
        handleSubmitClick,
        handleClosePopup,
    };
};
