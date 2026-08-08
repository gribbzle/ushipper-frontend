import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { useCreateParsedOrderCall } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { loadboardActions } from '@store/client/loadboard/slice';
import { authorizedUserSelector } from '@store/global';
import { Call, Device } from '@twilio/voice-sdk';
import { translateByNamespace } from '@utils/i18n';

import { useDuration } from './use-duration';

const t = translateByNamespace('client:loadboard:calling');

export const useTwilioCall = (loadBoardFilters: LoadBoardFilters | null) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(authorizedUserSelector);
    const twilioToken = undefined;
    const { formattedDuration, handleStop, handleStart } = useDuration();
    const createParsedOrderCall = useCreateParsedOrderCall();

    const stopCallAndResetState = useCallback(() => {
        handleStop();

        dispatch(
            loadboardActions.setCallingPopupState({
                call: null,
                isOpened: false,
                name: null,
                phoneNumber: null,
                orderPublicId: null,
            }),
        );
    }, [dispatch, handleStop]);

    const handleErrorAndDisconnect = useCallback(
        (call: Call | null) => {
            if (call) {
                call.disconnect();
            }

            toast.error<string>(t('during-call-error'));
            stopCallAndResetState();
        },
        [stopCallAndResetState],
    );

    const handleCall = useCallback(
        async (phoneNumber: string | null, publicOrderId: string | null, incomingCall: Call | null) => {
            if (twilioToken && phoneNumber) {
                let call: Call | null = incomingCall;

                if (call) {
                    handleStart();
                } else {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                        stream.getTracks().forEach(track => track.stop());

                        const device = new Device(twilioToken);

                        const errorPromise = new Promise<never>((_, reject) => {
                            device.on('error', (err: { message?: string }) => {
                                stopCallAndResetState();
                                reject(new Error(err.message || 'Unknown Twilio error'));
                            });
                        });

                        try {
                            await Promise.race([device.register(), errorPromise]);

                            dispatch(loadboardActions.setIsRegisterTwilioSuccess(true));
                        } catch (err: unknown) {
                            const message = (err as Error)?.message || '';

                            dispatch(loadboardActions.setIsRegisterTwilioSuccess(false));
                            toast.error<string>(t(message.includes('20101') ? 'twilio-token-invalid' : 'during-call-error'));
                            console.error('Twilio error:', message);

                            return;
                        }

                        call = await device.connect({
                            params: {
                                To: phoneNumber,
                                user_id: user?.publicId || '',
                                order_id: publicOrderId || '',
                                StatusCallbackEvent: 'initiated ringing answered completed',
                            },
                        });

                        dispatch(loadboardActions.setCallingPopupState({ call }));

                        call.on('accept', handleStart);
                        call.on('error', () => handleErrorAndDisconnect(call));

                        call.on('disconnect', async () => {
                            stopCallAndResetState();
                            if (loadBoardFilters && publicOrderId) {
                                createParsedOrderCall(publicOrderId, loadBoardFilters);
                            }
                        });
                    } catch {
                        toast.error(t<string>('microphone-access-required-error'));
                        stopCallAndResetState();
                    }
                }
            } else {
                toast.error<string>(t('error'));
                stopCallAndResetState();
            }
        },
        [twilioToken, handleStart, user?.publicId, dispatch, stopCallAndResetState, loadBoardFilters, createParsedOrderCall, handleErrorAndDisconnect],
    );

    return { formattedDuration, handleCall };
};
