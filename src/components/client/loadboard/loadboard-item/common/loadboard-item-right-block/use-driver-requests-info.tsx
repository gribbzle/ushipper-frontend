import React, { useMemo } from 'react';

import { useMeCarrier, useMeCarrierDriver, useMeDispatcher, useMeDriverRelated } from '@hooks';
import { OrderRequest } from '@store/api/order-requests-types';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { getCompanyTypeTranslate } from '@utils/get-company-type-translate';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { LoadboardItemProps } from '../../loadboard-item.types';

import './loadboard-item-right-block.scss';

const cn = classname('loadboard-item-right-block');
const t = translateByNamespace('client:loadboard:item');

const getUniqueRequests = (requests: OrderRequest[]) => {
    const uniqueCreators = new Set();

    return requests.filter(request => {
        if (uniqueCreators.has(request.creator.publicId)) {
            return false;
        }
        uniqueCreators.add(request.creator.publicId);

        return true;
    });
};

export const useDriverRequestsInfo = ({ order }: Omit<LoadboardItemProps, 'tagged' | 'loadBoardFilters'>) => {
    const { latestOffer, driverRequests } = order;

    const isMeCarrierDriver = useMeCarrierDriver();
    const isMeCarrier = useMeCarrier();
    const isMeDispatcher = useMeDispatcher();
    const isDriver = useMeDriverRelated();

    const driverRequestForDriverInfo = useMemo(() => {
        if (isDriver && !latestOffer && driverRequests) {
            const firstRequest = driverRequests[0];

            if (firstRequest) {
                return firstRequest.canceledAt ? (
                    <span key={firstRequest.publicId} className={cn('driver-request-canceled')}>
                        {t('driver-request-canceled', { time: diffForHumans(new Date(firstRequest.canceledAt), true) })}
                    </span>
                ) : (
                    <span key={firstRequest.publicId} className={cn('driver-request-send')}>
                        {t('driver-request-to-dispatcher', {
                            name: getCompanyTypeTranslate('dispatcher'),
                            time: diffForHumans(new Date(firstRequest.createdAt), true),
                        })}
                    </span>
                );
            }
        }

        return null;
    }, [driverRequests, isDriver, latestOffer]);

    const driverRequestForDispatcherInfo = useMemo(() => {
        if ((isMeDispatcher || (isMeCarrier && !isMeCarrierDriver)) && !latestOffer && driverRequests) {
            const uniqueRequests = getUniqueRequests(driverRequests);

            return uniqueRequests.map(request =>
                request.canceledAt ? (
                    <span key={request.publicId} className={cn('driver-request-canceled')}>
                        {t('request-by-driver-canceled', {
                            driverName: request.creator.name,
                            time: diffForHumans(new Date(request.canceledAt), true),
                        })}
                    </span>
                ) : (
                    <span key={request.publicId} className={cn('driver-request-send')}>
                        {t('dispatcher-request-by-info', { name: request.creator.name, time: diffForHumans(new Date(request.createdAt), true) })}{' '}
                        {request.paymentPrice && `(${formatToCurrency(request.paymentPrice)})`}
                    </span>
                ),
            );
        }

        return null;
    }, [driverRequests, isMeCarrier, isMeCarrierDriver, isMeDispatcher, latestOffer]);

    return { driverRequestForDispatcherInfo, driverRequestForDriverInfo };
};
