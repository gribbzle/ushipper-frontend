import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { toKebabCase } from 'js-convert-case';

import { Accordion } from '@/components/common/accordion/accordion';
import { Button } from '@/components/common/button/button';
import { Loader } from '@/components/common/loader/loader';
import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { ArrowDownIcon, Ellipse } from '@icons';
import { useAppSelector } from '@store';
import { isShipperOrdersTrackingLoadingSelector, ShipperTrackingOrder } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { mapOrderStatusToTrackingStatus } from '@utils/tracking/map-order-status-to-tracking-order-status';
import { getTrackingOrderStatusTranslate } from '@utils/translate/tracking/get-tracking-order-status-translate';

import { ShipperTrackingOrderItem } from '../shipper-tracking-order-item';

import './shipper-orders-tab.scss';

type Props = {
    title: ReactNode;
    view: TrackingOrderStatus;
    orders: ShipperTrackingOrder[];
    opened?: boolean;
    showEllipseIcon?: boolean;
};

const PER_PAGE = 3;

const cn = classname('shipper-orders-tab');
const t = translateByNamespace('client:tracking-page:shipper-orders-list-paper');
const lT = translateByNamespace('client:loadboard-filters');

export const ShipperOrdersTab = ({ view, title, orders, opened = false, showEllipseIcon = true }: Props) => {
    const isLoading = useAppSelector(isShipperOrdersTrackingLoadingSelector);

    const [visibleCount, setVisibleCount] = useState(PER_PAGE);
    const totalCount = orders.length;
    const allVisible = visibleCount >= totalCount;

    const loadMore = useCallback(() => setVisibleCount(prevCount => Math.min(prevCount + PER_PAGE, totalCount)), [totalCount]);

    const loadLess = useCallback(() => setVisibleCount(PER_PAGE), []);

    const header = useMemo(() => {
        return (
            <div className={cn('header')}>
                {showEllipseIcon && <Ellipse className={cn('header-icon', { view: toKebabCase(view) })} />}
                {title}
                {!isLoading && <span className={cn('header-counter')}>{totalCount}</span>}
            </div>
        );
    }, [totalCount, title, view, showEllipseIcon, isLoading]);

    const displayedOrders = useMemo(() => {
        return orders.slice(0, visibleCount).map(order => {
            const { publicId, status } = order;
            const title = mapOrderStatusToTrackingStatus(status);

            return <ShipperTrackingOrderItem order={order} key={publicId} title={getTrackingOrderStatusTranslate(title)} view={title} />;
        });
    }, [orders, visibleCount]);

    const emptyBlock = useMemo(
        () => (
            <div className={cn('empty-wrapper')}>
                <span className={cn('empty')}>{t('no-data')}</span>
            </div>
        ),
        [],
    );

    return (
        <Accordion opened={!opened} title={header} reverse={true} className={cn('item')}>
            <div className={cn()}>
                {isLoading ? (
                    <span className={cn('empty')}>
                        <Loader />
                    </span>
                ) : (
                    <>
                        {displayedOrders && displayedOrders.length > 0 ? (
                            <>
                                {displayedOrders}
                                {totalCount > PER_PAGE && (
                                    <>
                                        {/* Show "Load More" if not all orders are displayed */}
                                        {!allVisible && (
                                            <Button view='link' active={true} size='mini' onClick={loadMore}>
                                                <ArrowDownIcon /> {lT('show-more')}
                                            </Button>
                                        )}
                                        {/* Show "Load Less" if all orders are displayed */}
                                        {allVisible && (
                                            <Button view='link' active={true} size='mini' onClick={loadLess}>
                                                <ArrowDownIcon className={cn('arrow-icon', { rotate: true })} />
                                                {lT('show-less')}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            emptyBlock
                        )}
                    </>
                )}
            </div>
        </Accordion>
    );
};
