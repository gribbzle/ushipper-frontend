import React from 'react';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';

import { OrderFieldsGroup } from '@store/client';

type ContextInitState = {
    contactInfoFooterSwitchActiveState: {
        [key: string]: boolean;
    };
    contactInfoFooterCopyBtnActiveState: {
        [key: string]: boolean;
    };
    toggleSwitchState: (
        prefix: OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION | OrderFieldsGroup.CUSTOMER_INFORMATION,
        val: boolean,
    ) => void;
    toggleCopyBtnState: (prefix: OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION, val: boolean) => void;
};

const contextInitState = {
    contactInfoFooterSwitchActiveState: {
        [OrderFieldsGroup.DELIVERY_INFORMATION]: false,
        [OrderFieldsGroup.PICKUP_INFORMATION]: false,
        [OrderFieldsGroup.CUSTOMER_INFORMATION]: false,
    },
    contactInfoFooterCopyBtnActiveState: {
        [OrderFieldsGroup.DELIVERY_INFORMATION]: false,
        [OrderFieldsGroup.PICKUP_INFORMATION]: false,
    },
    toggleSwitchState: (
        prefix: OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION | OrderFieldsGroup.CUSTOMER_INFORMATION,
        val: boolean,
    ) => {
        console.log(val);
    },
    toggleCopyBtnState: (prefix: OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION, val: boolean) => {
        console.log(val);
    },
};

export const ContactFooterContext = createContext<ContextInitState>(contextInitState);

export const ContactFooterContextProvider = ({ children }: PropsWithChildren) => {
    const [contactInfoFooterSwitchActiveState, setContactInfoFooterSwitchState] = useState(contextInitState.contactInfoFooterSwitchActiveState);
    const toggleSwitchState = useCallback(
        (prefix: OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION | OrderFieldsGroup.CUSTOMER_INFORMATION, val: boolean) => {
            setContactInfoFooterSwitchState({
                ...contactInfoFooterSwitchActiveState,
                [prefix]: val,
            });
        },
        [contactInfoFooterSwitchActiveState],
    );

    const [contactInfoFooterCopyBtnActiveState, setContactInfoFooterCopyBtnActiveState] = useState(contextInitState.contactInfoFooterCopyBtnActiveState);
    const toggleCopyBtnState = useCallback(
        (prefix: OrderFieldsGroup.DELIVERY_INFORMATION | OrderFieldsGroup.PICKUP_INFORMATION, val: boolean) => {
            setContactInfoFooterCopyBtnActiveState({
                ...contactInfoFooterCopyBtnActiveState,
                [prefix]: val,
            });
        },
        [contactInfoFooterCopyBtnActiveState],
    );

    return (
        <ContactFooterContext.Provider
            value={{
                contactInfoFooterSwitchActiveState,
                contactInfoFooterCopyBtnActiveState,
                toggleSwitchState,
                toggleCopyBtnState,
            }}
        >
            {children}
        </ContactFooterContext.Provider>
    );
};
