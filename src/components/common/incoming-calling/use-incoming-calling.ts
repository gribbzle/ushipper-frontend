import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch } from '@store';
import { loadboardActions } from '@store/client/loadboard';
import { twilioActions } from '@store/common/twilio';
import { Call, Device } from '@twilio/voice-sdk';

import { IncomingCallParameters } from './incoming-calling.types';

export const useIncomingCalling = () => {
    // const user = useAppSelector(authorizedUserSelector);
    const twilioToken = undefined;
    // const { data: twilioToken } = useGetTokenQuery(undefined, { skip: !user });
    const dispatch = useAppDispatch();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleReject = useCallback(() => {
        incomingCall?.reject();
        setIsPopupVisible(false);
    }, [incomingCall]);

    const handleIncomingCall = useCallback(
        (incomingCall: Call) => {
            const parameters = incomingCall.parameters as IncomingCallParameters;

            setIsPopupVisible(true);
            setPhoneNumber(parameters.From);
            setIncomingCall(incomingCall);

            if (audioRef.current) {
                audioRef.current.play();
            }

            incomingCall.on('disconnect', handleReject);
            incomingCall.on('cancel', handleReject);
        },
        [handleReject],
    );

    const handleAccept = useCallback(() => {
        incomingCall?.accept();
        setIsPopupVisible(false);

        dispatch(
            loadboardActions.setCallingPopupState({
                isOpened: true,
                phoneNumber,
                call: incomingCall,
            }),
        );
    }, [dispatch, incomingCall, phoneNumber]);

    useEffect(() => {
        if (twilioToken) {
            const device = new Device(twilioToken);

            device.register().then(() => {
                dispatch(twilioActions.setDevice(device));

                device.on('incoming', handleIncomingCall);
            });
        }
    }, [dispatch, handleIncomingCall, twilioToken]);

    return {
        audioRef,
        phoneNumber,
        isPopupVisible,
        handleReject,
        handleAccept,
    };
};
