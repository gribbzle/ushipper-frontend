import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, linkFuelCardPopupPropsSelector } from '@store/admin';

import { LinkFuelCardFormState } from './link-fuel-card-form/link-fuel-card-form.types';

export const useLinkFuelCardPopup = () => {
    const { isPopupOpened, driverName } = useAppSelector(linkFuelCardPopupPropsSelector);
    const formRef = useRef<FormApi<LinkFuelCardFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleClosePopup = useCallback(
        () => dispatch(accountingActions.setLinkFuelCardPopupProps({ isPopupOpened: false, accountId: null, driverName: null })),
        [dispatch],
    );

    return {
        formRef,
        isPopupOpened,
        driverName,
        handleSubmitClick,
        handleClosePopup,
    };
};
