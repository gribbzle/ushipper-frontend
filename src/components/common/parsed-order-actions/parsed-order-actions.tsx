import React from 'react';

import { ChoosePhonePopup } from '@/components/client/loadboard/choose-phone-popup/choose-phone-popup';
import { LoadboardItemProps } from '@/components/client/loadboard/loadboard-item/loadboard-item.types';
import { Button } from '@/components/common/button/button';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { UserOrderStatus } from '@/enums';
import { ActionsIcon, PhoneIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ParsedOrderChatButton } from './parsed-order-chat-button';
import { useParsedOrderActions } from './use-parsed-order-actions';

import './parsed-order-actions.scss';

const cn = classname('parsed-order-actions');
const t = translateByNamespace('client:loadboard:item');
const translateRequest = translateByNamespace('client:loadboard:request-form');

export const ParsedOrderActions = ({ order, loadBoardFilters }: Omit<LoadboardItemProps, 'tagged'>) => {
    const { userOrderStatus } = order;
    const {
        options,
        isSendRequest,
        showCheckSDOfferButton,
        showCheckContractButton,
        showCallButton,
        showSDRequestButton,
        isDriver,
        handleCheckSDOffer,
        isChoosePhoneForCallPopupOpened,
        setIsChoosePhoneForCallPopupOpened,
        handleRequestSuperDispatchOrder,
        handleCheckContract,
        handleOpenOrder,
        handleSendRequest,
        handleCancelRequest,
    } = useParsedOrderActions({
        order,
        loadBoardFilters,
    });

    return (
        <div className={cn('')}>
            {isDriver && (
                <>
                    {isSendRequest ? (
                        <Button
                            view='primary'
                            size='small'
                            onClick={e => {
                                e.stopPropagation();
                                handleSendRequest();
                            }}
                            disabled={userOrderStatus === UserOrderStatus.BOOKED}
                        >
                            {t('send-request')}
                        </Button>
                    ) : (
                        <Button
                            view='danger'
                            size='small'
                            onClick={e => {
                                e.stopPropagation();
                                handleCancelRequest();
                            }}
                            disabled={userOrderStatus === UserOrderStatus.BOOKED}
                        >
                            {translateRequest('cancel-request-btn')}
                        </Button>
                    )}
                </>
            )}
            {!isDriver && (
                <>
                    {showCheckContractButton && (
                        <Button size='small' onClick={handleCheckContract} view='primary'>
                            {t('check-contract')}
                        </Button>
                    )}
                    {showCheckSDOfferButton && (
                        <Button size='small' onClick={handleCheckSDOffer} view='primary'>
                            {t('check-offer')}
                        </Button>
                    )}
                    {showCallButton && (
                        <Button
                            view='primary'
                            plain={true}
                            size='small'
                            onClick={e => {
                                e.stopPropagation();
                                setIsChoosePhoneForCallPopupOpened(true);
                            }}
                        >
                            <PhoneIcon /> {t('call')}
                        </Button>
                    )}
                    {showSDRequestButton && (
                        <Button view='primary' plain={true} size='small' onClick={e => handleRequestSuperDispatchOrder(e)}>
                            {t('request')}
                        </Button>
                    )}
                    {userOrderStatus === UserOrderStatus.BOOKED && (
                        <Button
                            size='small'
                            onClick={e => {
                                e.stopPropagation();
                                handleOpenOrder();
                            }}
                        >
                            {t('open-order')}
                        </Button>
                    )}
                    {userOrderStatus !== UserOrderStatus.BOOKED && userOrderStatus !== UserOrderStatus.DECLINED && (
                        <ParsedOrderChatButton order={order} loadBoardFilters={loadBoardFilters} />
                    )}
                </>
            )}
            <Dropdown options={options}>
                <Button size='small' className={cn('actions')}>
                    <ActionsIcon />
                </Button>
            </Dropdown>
            {isChoosePhoneForCallPopupOpened && (
                <ChoosePhonePopup loadBoardFilters={loadBoardFilters} onClose={() => setIsChoosePhoneForCallPopupOpened(false)} order={order} />
            )}
        </div>
    );
};
