import React, { useMemo } from 'react';

import { OrderChat } from '@/components/client/orders/show/order-chat/order-chat';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { useMeDriverRelated } from '@hooks';
import { GeoLocationIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useOrderChatDrawer } from './use-order-chat-drawer';

import './order-chat-drawer.scss';

const t = translateByNamespace('client:order:order-chat');
const cn = classname('order-chat-drawer');

export const OrderChatDrawer = () => {
    const { openDriverTracking, handleClose, isVisible, driver } = useOrderChatDrawer();
    const isDriver = useMeDriverRelated();

    const headerBtn = useMemo(() => {
        return (
            <Button view='primary' size='small' plain={true} onClick={openDriverTracking}>
                <GeoLocationIcon />
                {t('chat-btn-title')}
            </Button>
        );
    }, [openDriverTracking]);

    const header = useMemo(() => {
        return (
            <div className={cn('head')}>
                {t('header')} {!isDriver && driver ? headerBtn : undefined}
            </div>
        );
    }, [driver, isDriver, headerBtn]);

    return <Drawer isOpen={isVisible} onClose={handleClose} head={header} body={<OrderChat />} className={cn()} />;
};
