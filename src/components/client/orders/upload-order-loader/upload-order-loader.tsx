import React, { useEffect, useState } from 'react';

import { classname, translateByNamespace } from '@utils';

const messages = ['order', 'pickup', 'delivery', 'vehicles', 'payment', 'broker'];

import './upload-order-loader.scss';

const cn = classname('dots');
const tMessage = translateByNamespace('client:order:loader-messages');

export const UploadOrderLoader = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => {
                if (prevIndex < messages.length - 1) {
                    return prevIndex + 1;
                } else {
                    clearInterval(interval);

                    return prevIndex;
                }
            });
        }, 3500);

        return () => {
            clearInterval(interval);
            setMessageIndex(0);
        };
    }, []);

    return (
        <>
            {tMessage(messages[messageIndex])}
            <span className={cn()}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </span>
        </>
    );
};
