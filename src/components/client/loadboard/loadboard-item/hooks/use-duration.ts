import { useCallback, useRef, useState } from 'react';
import { intervalToDuration } from 'date-fns';

export const useDuration = () => {
    const [durationSeconds, setDurationSeconds] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const durationObj = intervalToDuration({ start: 0, end: durationSeconds * 1000 });

    const handleStart = useCallback(() => {
        intervalRef.current = setInterval(() => {
            setDurationSeconds(duration => duration + 1);
        }, 1000);
    }, []);

    const handleStop = useCallback(() => {
        clearInterval(intervalRef.current);
        setDurationSeconds(0);
    }, []);

    return {
        formattedDuration:
            durationObj.minutes || durationObj.seconds ? `${String(durationObj.minutes).padStart(2, '0')}:${String(durationObj.seconds).padStart(2, '0')}` : '',
        handleStop,
        handleStart,
    };
};
