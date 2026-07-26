import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { Button, CheckingContractPopup, MapBox, useTrackingDisplayedPathsOnMap } from '@/components';
import { OrderSourcesEnum } from '@enums';
import { SearchIcon } from '@icons';
import { useAppDispatch } from '@store';
import { LoadBoardFilters, useGetLoadboardItemsQuery } from '@store/api/loadboard-api';
import { useGetTrackingQuery } from '@store/api/users-api';
import { trackingActions } from '@store/client';
import { User } from '@store/common';
import { classname, translateByNamespace } from '@utils';

import { DriverItemTab } from '../driver-item-tab';

import { DriverOrdersBlock } from './driver-orders-block';

import './driver-orders-accordion.scss';

const cn = classname('driver-orders-accordion');
const t = translateByNamespace('client:drivers-plan:driver-item:orders-tab');

export const DriverOrdersAccordion = ({ driver: { name, publicId } }: { driver: User }) => {
    const [page, setPage] = useState<number>(1);
    const dispatch = useAppDispatch();

    const filters = useMemo(
        (): LoadBoardFilters => ({
            perPage: 3,
            page,
            sources: [OrderSourcesEnum.CENTRAL_DISPATCH_PARSED, OrderSourcesEnum.SUPER_DISPATCH_PARSED],
        }),
        [page],
    );

    const { data: suggestedOrdersData } = useGetLoadboardItemsQuery({ filters });

    const handleSearchOrdersClick = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setPage(page + 1);
        },
        [setPage, page],
    );

    const { data: tracking } = useGetTrackingQuery({ query: name });

    const displayedPathsOnMap = useTrackingDisplayedPathsOnMap(tracking, publicId, null);

    useEffect(() => {
        dispatch(trackingActions.setTestRoutePathLogic(true));
    }, [dispatch]);

    return (
        <>
            <DriverItemTab
                title={t('title')}
                head={
                    <Button plain={true} size='small' view='primary' onClick={e => handleSearchOrdersClick(e)}>
                        <SearchIcon />
                        {t('search-orders-btn')}
                    </Button>
                }
                body={
                    <div className={cn('content-map')}>
                        <MapBox id={`map-${publicId}`} />
                        {/*<DriversTrackingMap*/}
                        {/*    displayedPointsOnMap={displayedPathsOnMap}*/}
                        {/*    orderColors={orderColors}*/}
                        {/*    trackingInfo={trackingData}*/}
                        {/*    defaultColor={DEFAULT_COLOR}*/}
                        {/*    suggestedOrders={suggestedOrdersData?.data}*/}
                        {/*/>*/}
                        <DriverOrdersBlock
                            className={cn('content-details')}
                            suggestedOrders={suggestedOrdersData?.data}
                            suggestedFilters={filters}
                            driverId={publicId}
                        />
                    </div>
                }
                className={cn('content')}
            />
            <CheckingContractPopup loadBoardFilters={filters} />
        </>
    );
};
