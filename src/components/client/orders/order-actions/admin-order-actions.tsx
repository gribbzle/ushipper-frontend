import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/common/button/button';
import { Dropdown } from '@/components/common/dropdown/dropdown';
import { DropdownDividerOption } from '@/components/common/dropdown/dropdown';
import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { OrderStatus } from '@/enums/order-status';
import { useHandleSendBOLDrawer } from '@/hooks/order/use-handle-send-bol-drawer';
import { useHandleViewBol } from '@/hooks/order/use-handle-view-bol';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-actions.scss';
import HorizontalDotsIcon from '@/assets/icons/horizontal-dots.svg';

const t = translateByNamespace('client:order-actions');
const tOptions = translateByNamespace('client:orders-page:order-options-dropdown');

const cn = classname('order-actions');

export const AdminOrderActions = ({ order }: { order: Load }) => {
    const router = useRouter();
    const { status, deletedAt, archivedAt, publicId } = order;

    const isCarriersOrdersPage = useMemo(() => router.pathname.includes('carrier'), [router.pathname]);

    const showOptionsButton = isCarriersOrdersPage && !(deletedAt && status === OrderStatus.NEW);

    const showViewBol = useMemo(() => [OrderStatus.NEW, OrderStatus.PICKED_UP, OrderStatus.DELIVERED].includes(status) && !archivedAt, [status, archivedAt]);

    const handleViewBolClick = useHandleViewBol(publicId);
    const handleSendBOLDrawerOpen = useHandleSendBOLDrawer(publicId);

    const options: (DropdownOption | DropdownDividerOption)[] = useMemo(
        () => [
            {
                label: tOptions('send-bol-option'),
                onClick: handleSendBOLDrawerOpen,
            },
            {
                label: tOptions('view-bol-option'),
                onClick: handleViewBolClick,
                show: showViewBol,
            },
        ],
        [showViewBol, handleViewBolClick, handleSendBOLDrawerOpen],
    );

    if (!showOptionsButton) {
        return null;
    }

    return (
        <Dropdown className={cn('admin')} options={options}>
            <Button size='medium'>
                <HorizontalDotsIcon />
                {t('more-button-title')}
            </Button>
        </Dropdown>
    );
};
