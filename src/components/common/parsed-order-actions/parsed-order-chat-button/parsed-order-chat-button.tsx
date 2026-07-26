import React from 'react';

import { ChoosePhonePopup } from '@/components/client/loadboard/choose-phone-popup/choose-phone-popup';
import { Button } from '@components';
import { MessageTextLeftIcon } from '@icons';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';
import { classname } from '@utils';

import { useParsedOrderChatButton } from './use-parsed-order-chat-button';

import './parsed-order-chat-button.scss';

const cn = classname('parsed-order-chat-button');

type Props = {
    order: Load;
    loadBoardFilters: LoadBoardFilters;
};

export const ParsedOrderChatButton = ({ order, loadBoardFilters }: Props) => {
    const { isChoosePopupForMessageOpened, setIsChoosePopupForMessageOpened, handleOpenOrderChatDrawer } = useParsedOrderChatButton(order.customerInformation);

    return (
        <div className={cn('')}>
            <Button size='small' onClick={handleOpenOrderChatDrawer} className={cn('action')}>
                <MessageTextLeftIcon />
            </Button>
            {isChoosePopupForMessageOpened && (
                <ChoosePhonePopup loadBoardFilters={loadBoardFilters} onClose={() => setIsChoosePopupForMessageOpened(false)} order={order} type='message' />
            )}
        </div>
    );
};
