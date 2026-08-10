import React, { MouseEvent, useCallback, useMemo, useState } from 'react';

import { Accordion } from '@/components/common/accordion/accordion';
import { Button } from '@/components/common/button/button';
import { Loader } from '@/components/common/loader/loader';
import { OfferToRequestStatusesEnum, RequestStatusesEnum } from '@/enums/request-statuses';
import { ArrowDownIcon } from '@icons';
import { useGetRequestsQuery } from '@store/api/order-requests-api';
import { ShipperTrackingOrder } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ActiveRequestItem } from './active-request-item';

import './active-requests.scss';

type ActiveRequestsProps = {
    order: ShipperTrackingOrder;
    onTop?: boolean;
};

const cn = classname('active-requests');
const t = translateByNamespace('client:tracking-page:active-requests');
const lT = translateByNamespace('client:loadboard-filters');

export const ActiveRequests = ({ order, onTop = false }: ActiveRequestsProps) => {
    const { publicId } = order;
    const [cursor, setCursor] = useState<string | undefined>();

    const { data: requestsData, isSuccess, isLoading } = useGetRequestsQuery({ orderId: publicId, cursor });

    const handleShowMoreRequests = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setCursor(requestsData?.nextCursor || undefined);
        },
        [requestsData?.nextCursor],
    );

    const filteredRequests = useMemo(
        () =>
            requestsData?.requests.filter(({ status, latestOffer }) => {
                const isCanceledOffer = status !== RequestStatusesEnum.DECLINED && latestOffer?.status === OfferToRequestStatusesEnum.CANCELED;

                return (status === RequestStatusesEnum.NEW && !latestOffer) || isCanceledOffer;
            }) || [],
        [requestsData?.requests],
    );

    const header = useMemo(() => {
        return (
            <div className={cn('header')}>
                {t('title')}
                {isSuccess && <span className={cn('header-counter')}>{filteredRequests.length}</span>}
            </div>
        );
    }, [filteredRequests.length, isSuccess]);

    const emptyBlock = useMemo(() => <span className={cn('empty')}>{t('no-data')}</span>, []);

    return (
        <Accordion opened={true} title={header} reverse={true} className={cn('', { 'on-top': onTop })} onTop={onTop} bottomSpacing={onTop ? 26 : undefined}>
            <div className={cn('body')}>
                {isLoading ? (
                    <span className={cn('empty')}>
                        <Loader />
                    </span>
                ) : (
                    <>
                        {filteredRequests.length > 0 ? (
                            <>
                                {filteredRequests.map(request => (
                                    <ActiveRequestItem request={request} key={request.publicId} order={order} />
                                ))}

                                {cursor && (
                                    <Button view='link' active={true} size='mini' onClick={handleShowMoreRequests}>
                                        <ArrowDownIcon /> {lT('show-more')}
                                    </Button>
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
