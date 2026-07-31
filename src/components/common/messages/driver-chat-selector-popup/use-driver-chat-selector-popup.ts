import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { driverChatSelectorPopupPropsSelector, getSupportChatRequestSelector, messagesActions } from '@store/common/messages';

import { DriverSelectorFormState } from './driver-chat-selector-form/driver-chat-selector-form.types';

export const useDriverChatSelectorPopup = () => {
    const { isPopupOpened } = useAppSelector(driverChatSelectorPopupPropsSelector);
    const { status: requestStatus } = useAppSelector(getSupportChatRequestSelector);
    const formRef = useRef<FormApi<DriverSelectorFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleClosePopup = useCallback(() => dispatch(messagesActions.setDriverChatSelectorPopupProps({ isPopupOpened: false })), [dispatch]);

    return { requestStatus, formRef, isPopupOpened, handleSubmitClick, handleClosePopup };
};
