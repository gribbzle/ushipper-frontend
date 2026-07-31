import React from 'react';

export type ChatProps = {
    chatId: string | null;
    mode?: 'drawer' | 'order-page';
    isNeedInitialize?: boolean;
    hideControls?: boolean;
    headerComponent?: React.ReactNode;
    externalPhone?: string | null;
    callback?: (value: string | null) => void;
};
