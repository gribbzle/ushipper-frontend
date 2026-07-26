import { MouseEvent, useCallback, useMemo, useState } from 'react';

import { formatPhoneNumber } from '@/components/client/loadboard/choose-phone-popup/format-phone-number';
import { useAppDispatch } from '@store';
import { chatsActions, openChatByPhoneAction, OrderCustomerInformation } from '@store/common';

export const useParsedOrderChatButton = (customerInformation: OrderCustomerInformation) => {
    const dispatch = useAppDispatch();

    const [isChoosePopupForMessageOpened, setIsChoosePopupForMessageOpened] = useState(false);

    const phone = useMemo(() => {
        const phone = customerInformation.externalCompany?.phone || customerInformation.phone;

        return phone ? formatPhoneNumber(phone) : '';
    }, [customerInformation.externalCompany?.phone, customerInformation.phone]);

    const handleOpenOrderChatDrawer = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();

            dispatch(openChatByPhoneAction(phone)).then(res => {
                if (res.payload) {
                    dispatch(
                        chatsActions.setIsDrawerOpen({
                            isDrawerOpen: true,
                            needToReset: false,
                            setSelectedAtTop: true,
                        }),
                    );

                    return;
                }

                setIsChoosePopupForMessageOpened(true);
            });
        },
        [dispatch, phone],
    );

    return {
        isChoosePopupForMessageOpened,
        setIsChoosePopupForMessageOpened,
        handleOpenOrderChatDrawer,
    };
};
