import { useCallback, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { chatsActions, openChatByPhoneAction } from '@store/client';
import { isRegisterTwilioSuccessSelector, loadboardActions, loadboardCallingPopupStateSelector } from '@store/client/loadboard';
import { Call } from '@twilio/voice-sdk';

export const useCallingPopup = () => {
    const { call, isOpened, name, phoneNumber, orderPublicId, loadBoardFilters } = useAppSelector(loadboardCallingPopupStateSelector);
    const isRegisterTwilioSuccess = useAppSelector(isRegisterTwilioSuccessSelector);

    const dispatch = useAppDispatch();

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const handleKeyboardInput = useCallback(
        (key: string) => {
            call?.sendDigits(key);
        },
        [call],
    );

    const handleClose = useCallback(
        (call: Call | null) => {
            if (call) {
                call.disconnect();
            }

            dispatch(
                loadboardActions.setCallingPopupState({
                    name: null,
                    isOpened: false,
                    call: null,
                    phoneNumber: null,
                    orderPublicId: null,
                }),
            );
            setIsKeyboardVisible(false);
        },
        [dispatch],
    );

    const handleOpenOrderChatDrawer = useCallback(() => {
        dispatch(openChatByPhoneAction(phoneNumber ?? '')).then(() => {
            dispatch(
                chatsActions.setIsDrawerOpen({
                    isDrawerOpen: true,
                    needToReset: false,
                    setSelectedAtTop: true,
                }),
            );
        });
    }, [dispatch, phoneNumber]);

    const [isMuted, setIsMuted] = useState(false);

    const handleMute = useCallback(() => {
        call?.mute(!isMuted);
        setIsMuted(!isMuted);
    }, [call, isMuted]);

    const hideCallingPopup = useMemo(() => !isOpened || !isRegisterTwilioSuccess, [isOpened, isRegisterTwilioSuccess]);

    return {
        call,
        name,
        isMuted,
        isOpened,
        phoneNumber,
        orderPublicId,
        loadBoardFilters,
        isKeyboardVisible,
        hideCallingPopup,
        handleMute,
        handleClose,
        handleKeyboardInput,
        setIsKeyboardVisible,
        handleOpenOrderChatDrawer,
    };
};
