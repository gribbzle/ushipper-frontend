import React, { memo, useMemo } from 'react';

import { OrderTag } from '@/components/client/orders/order-tag';
import { OrderStatus, SidebarCountsEnum } from '@/enums';
import { useMeShipper } from '@hooks';
import { useAppSelector } from '@store';
import { authorizedUserSelector, driverPaymentRequestsCounterSelector, issuesCounterSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateOrderStatus } from '@utils/translate/order/get-order-status-translate';

import { ItemBadgeCountProps } from '../../sidebar.types';

const cn = classname('main-layout-sidebar');

const t = translateByNamespace('common:sidebar');
const tOffer = translateByNamespace('client:order-offers');

type RenderTagProps = {
    view: string;
    status: OrderStatus;
    badgeCount?: string | number;
};

const renderTag = ({ view, status, badgeCount }: RenderTagProps) => (
    <OrderTag view={view}>
        {badgeCount} {translateOrderStatus(status)}
    </OrderTag>
);

const prepareCount = (count?: number | null) => (count && count > 100 ? '99+' : count ?? undefined);

export const ItemBadgeCount = memo(({ name, labelCountField }: ItemBadgeCountProps) => {
    const user = useAppSelector(authorizedUserSelector);
    const driverPaymentRequestsCounter = useAppSelector(driverPaymentRequestsCounterSelector);
    const issuesCounter = useAppSelector(issuesCounterSelector);

    const isShipperPage = useMeShipper();

    const badgeCount = useMemo<string | number | undefined>(() => {
        if (!labelCountField || !user) {
            return;
        }

        switch (labelCountField) {
            case SidebarCountsEnum.driverPaymentRequestsCounter:
                return prepareCount(driverPaymentRequestsCounter);

            case SidebarCountsEnum.issuesCounter:
                return prepareCount(issuesCounter);

            default:
                return prepareCount(user[labelCountField]);
        }
    }, [labelCountField, user, driverPaymentRequestsCounter, issuesCounter]);

    const renderTagElement = useMemo<JSX.Element | null>(() => {
        if (!labelCountField || !badgeCount) return null;

        const tagsMap: Partial<Record<SidebarCountsEnum, JSX.Element>> = {
            [SidebarCountsEnum.unreadChatMessagesCount]: renderTag({
                view: 'canceled',
                status: OrderStatus.NEW,
                badgeCount,
            }),
            [SidebarCountsEnum.driverPaymentRequestsCounter]: renderTag({
                view: 'tagged',
                status: OrderStatus.PENDING,
                badgeCount,
            }),
            [SidebarCountsEnum.issuesCounter]: renderTag({
                view: 'tagged',
                status: OrderStatus.PENDING,
                badgeCount,
            }),
        };

        const defaultTag = (
            <OrderTag view='new'>
                {badgeCount}{' '}
                {name === t('offers-tab-label') && isShipperPage ? tOffer(`status:shipper-${OrderStatus.NEW}`) : translateOrderStatus(OrderStatus.NEW)}
            </OrderTag>
        );

        return tagsMap[labelCountField] || defaultTag;
    }, [labelCountField, badgeCount, name, isShipperPage]);

    if (!renderTagElement) {
        return null;
    }

    return <div className={cn('link-badge')}>{renderTagElement}</div>;
});

ItemBadgeCount.displayName = 'ItemBadgeCount';
