import React, { useCallback } from 'react';

import { Button } from '@/components/common/button/button';
import { useAppDispatch } from '@store';
import { loadboardActions } from '@store/client/loadboard';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './call-button-block.scss';
import PhoneIcon from '@/assets/icons/phone.svg';

const tCall = translateByNamespace('client:loadboard:item');

const cn = classname('call-button-block');

export const CallButtonBlock = ({ phone }: { phone: string }) => {
    const dispatch = useAppDispatch();

    const handleCallButton = useCallback(() => {
        dispatch(
            loadboardActions.setCallingPopupState({
                //  TODO replace information with real data - name
                name: null,
                isOpened: true,
                phoneNumber: phone,
                orderPublicId: null,
            }),
        );
    }, [dispatch, phone]);

    return (
        <div className={cn()}>
            <Button
                view='primary'
                plain={true}
                size='small'
                onClick={e => {
                    e.stopPropagation();
                    handleCallButton();
                }}
            >
                <PhoneIcon /> {tCall('call')}
            </Button>
        </div>
    );
};
