import React, { useState } from 'react';

import { ChoosePhonePopup } from '@/components/client/loadboard/choose-phone-popup/choose-phone-popup';
import { Button, ParsedOrderChatButton } from '@/components/common';
import { useMeAdmin, useMeDriverRelated } from '@hooks';
import { PhoneIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { BrokerDetailsHeaderProps } from './broker-details-header.types';

import './broker-details-header.scss';

const t = translateByNamespace('client:loadboard:load-details');
const tCall = translateByNamespace('client:loadboard:item');

const cn = classname('broker-details-header');

export const BrokerDetailsHeader = ({ order, loadBoardFilters }: BrokerDetailsHeaderProps) => {
    const [isChoosePhonePopupOpened, setIsChoosePhonePopupOpened] = useState(false);
    const isMeDriver = useMeDriverRelated();
    const isMeAdmin = useMeAdmin();

    return (
        <div className={cn('')}>
            <div className={cn('title')}>{t('broker-details')}</div>
            {!(isMeDriver || isMeAdmin) && (
                <div className={cn('buttons')}>
                    <div className={cn('call')}>
                        <Button view='primary' plain={true} size='small' onClick={() => setIsChoosePhonePopupOpened(true)}>
                            <PhoneIcon /> {tCall('call')}
                        </Button>
                        {isChoosePhonePopupOpened && loadBoardFilters && (
                            <ChoosePhonePopup loadBoardFilters={loadBoardFilters} onClose={() => setIsChoosePhonePopupOpened(false)} order={order} />
                        )}
                    </div>
                    <ParsedOrderChatButton order={order} loadBoardFilters={loadBoardFilters || {}} />
                </div>
            )}
        </div>
    );
};
