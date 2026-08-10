import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { GenericButton } from '@/components/common/generic-button/generic-button';
import { Paper } from '@/components/common/paper/paper';
import useOutsideCLick from '@/hooks/use-outside-cLick';
import { useAppDispatch } from '@store';
import { chatsActions, messagesActions, openChatByPhoneAction } from '@store/client';
import { loadboardActions } from '@store/client/loadboard';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { cleanPhoneNumber } from '@utils/phone';

import { ChoosePhonePopupProps } from './choose-phone-popup.types';
import { formatPhoneNumber } from './format-phone-number';
import { PhoneItem } from './phone-item';
import { PhoneNumberInput } from './phone-number-input';

import './choose-phone-popup.scss';
import MessageFilledIcon from '@/assets/icons/message-filled-icon.svg';
import PhoneFilledIcon from '@/assets/icons/phone-filled.svg';
import UserCircle from '@/assets/icons/user-circle.svg';

const cn = classname('choose-phone-popup');
const t = translateByNamespace('client:loadboard:calling');

export const ChoosePhonePopup = ({ order, loadBoardFilters, type = 'call', context = 'drawer', onClose }: ChoosePhonePopupProps) => {
    const phone = order?.customerInformation.externalCompany?.phone || order?.customerInformation.phone || null;
    const { mainPhone, localPhone, faxNumber } = order?.customerInformation.externalCompany?.contactInformation || {};
    const [phoneNumberInput, setPhoneNumberInput] = useState('');

    const dispatch = useAppDispatch();

    const disabled = useMemo(() => (phoneNumberInput || '').length < 14, [phoneNumberInput]);

    const handleChangePhoneNumber = useCallback(({ phone }: { phone: string }) => {
        setPhoneNumberInput(phone || '');
    }, []);

    const ref = useRef<HTMLInputElement>(null);
    const clickOutsideHandler = useCallback(
        (outside: boolean) => {
            if (outside) {
                onClose();
            }
        },
        [onClose],
    );

    useOutsideCLick(ref, clickOutsideHandler);

    const isCall = type === 'call';

    const handleChoosePhoneNumber = useCallback(
        (phoneNumber: string | null) => {
            if (phoneNumber) {
                if (isCall) {
                    dispatch(
                        loadboardActions.setCallingPopupState({
                            name: order?.customerInformation.customerName,
                            isOpened: true,
                            phoneNumber,
                            orderPublicId: order?.publicId,
                            loadBoardFilters,
                        }),
                    );
                } else {
                    dispatch(openChatByPhoneAction(phoneNumber)).then(res => {
                        if (res.payload) {
                            if (context === 'drawer') {
                                dispatch(
                                    chatsActions.setIsDrawerOpen({
                                        isDrawerOpen: true,
                                        needToReset: false,
                                        setSelectedAtTop: true,
                                    }),
                                );
                            }

                            if (context === 'messages-page') {
                                dispatch(messagesActions.setChatsSearchText(cleanPhoneNumber(phoneNumber)));
                            }

                            return;
                        }

                        dispatch(
                            loadboardActions.setBetweenPhonesChatDrawer({
                                isVisible: true,
                                externalNumber: phoneNumber,
                            }),
                        );
                    });
                }

                onClose();
            }
        },
        [isCall, onClose, dispatch, order?.customerInformation.customerName, order?.publicId, loadBoardFilters, context],
    );

    const showPhonesList = mainPhone || localPhone || faxNumber;

    return (
        <Paper
            className={cn('')}
            theme='dark'
            paperRef={ref}
            body={
                <div onClick={e => e.stopPropagation()} className={cn('body')}>
                    {order && (
                        <div className={cn('header')}>
                            <div className={cn('title')}>{order.customerInformation.customerName}</div>
                            <div className={cn('start-call')}>
                                <div className={cn('start-call-info')}>
                                    <UserCircle />
                                    <div className={cn('start-call-phone-number')}>{formatPhoneNumber(phone)}</div>
                                </div>

                                <Button
                                    onClick={() => handleChoosePhoneNumber(phone)}
                                    view='primary-green'
                                    size='small'
                                    className={cn('start-call-btn', [isCall ? '' : cn('message')])}
                                >
                                    {isCall ? (
                                        <>
                                            <PhoneFilledIcon /> {t('start-a-call')}
                                        </>
                                    ) : (
                                        <>
                                            <MessageFilledIcon /> {t('message')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className={cn('phones')}>
                        <Form
                            onSubmit={handleChangePhoneNumber}
                            render={() => (
                                <form className={cn('form')}>
                                    <FormValuesSpy onChange={handleChangePhoneNumber} />
                                    <Field name='phone' component={PhoneNumberInput} />
                                    <GenericButton view='accent' figure='circle' onClick={() => handleChoosePhoneNumber(phoneNumberInput)} disabled={disabled}>
                                        {isCall ? <PhoneFilledIcon /> : <MessageFilledIcon />}
                                    </GenericButton>
                                </form>
                            )}
                        />
                        {showPhonesList && (
                            <div className={cn('phones-list')}>
                                {mainPhone && (
                                    <PhoneItem isMessage={!isCall} onClick={() => handleChoosePhoneNumber(mainPhone)} type='main' phoneNumber={mainPhone} />
                                )}
                                {localPhone && (
                                    <PhoneItem isMessage={!isCall} type='local' onClick={() => handleChoosePhoneNumber(localPhone)} phoneNumber={localPhone} />
                                )}
                                {faxNumber && (
                                    <PhoneItem isMessage={!isCall} type='fax' onClick={() => handleChoosePhoneNumber(faxNumber)} phoneNumber={faxNumber} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            }
        />
    );
};
