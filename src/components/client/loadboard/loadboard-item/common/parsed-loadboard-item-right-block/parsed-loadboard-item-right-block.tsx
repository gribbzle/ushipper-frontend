import React from 'react';

import { ParsedOrderActions } from '@components';
import { classname, diffForHumans, formatToCurrency, getCompanyTypeTranslate, translateByNamespace } from '@utils';

import { LoadboardItemProps } from '../../loadboard-item.types';

import { useParsedLoadboardItemRightBlock } from './use-parsed-loadboard-item-right-block';

import './parsed-loadboard-item-right-block.scss';

const cn = classname('parsed-loadboard-item-right-block');
const t = translateByNamespace('client:loadboard:item');

export const ParsedLoadboardItemRightBlock = ({ order, loadBoardFilters }: Omit<LoadboardItemProps, 'tagged'>) => {
    const { contractCheckedAt, latestRequest, driverRequests, contractFoundAt, contractSignedAt } = order;
    const { dispatcherInfo, isForDispatcherInfo, isForDriverRequestInfo, showCheckContractButton } = useParsedLoadboardItemRightBlock({
        order,
        loadBoardFilters,
    });

    return (
        <div className={cn('')}>
            {isForDriverRequestInfo &&
                driverRequests?.map(request =>
                    request.canceledAt ? (
                        <span key={request.publicId} className={cn('time')}>
                            {t('driver-request-canceled', { time: diffForHumans(new Date(request.canceledAt), true) })}
                        </span>
                    ) : (
                        <span key={request.publicId} className={cn('request')}>
                            {t('driver-request-to-dispatcher', {
                                name: getCompanyTypeTranslate('dispatcher'),
                                time: diffForHumans(new Date(request.createdAt), true),
                            })}
                        </span>
                    ),
                )}
            {isForDispatcherInfo &&
                latestRequest &&
                (latestRequest.canceledAt ? (
                    <span className={cn('time')}>{t('latest-request-canceled', { time: diffForHumans(new Date(latestRequest.canceledAt), true) })}</span>
                ) : (
                    <span className={cn('request')}>{dispatcherInfo}</span>
                ))}
            {isForDispatcherInfo &&
                driverRequests &&
                driverRequests.map(request =>
                    request.canceledAt ? (
                        <span key={request.publicId} className={cn('time')}>
                            {t('request-by-driver-canceled', { driverName: request.creator.name, time: diffForHumans(new Date(request.canceledAt), true) })}
                        </span>
                    ) : (
                        <span key={request.publicId} className={cn('request')}>
                            {t('dispatcher-request-by-info', { name: request.creator.name, time: diffForHumans(new Date(request.createdAt), true) })}{' '}
                            {request.paymentPrice && `(${formatToCurrency(request.paymentPrice)})`}
                        </span>
                    ),
                )}
            <div className={cn('wrapper')}>
                <ParsedOrderActions order={order} loadBoardFilters={loadBoardFilters} />
                {!contractFoundAt && !contractSignedAt && contractCheckedAt && showCheckContractButton && (
                    <span className={cn('time', [cn('checked')])}>{t('checked-time', { time: diffForHumans(new Date(contractCheckedAt), true) })}</span>
                )}
                {!contractFoundAt && contractFoundAt && <span className={cn('time', [cn('found'), cn('checked')])}>{t('contract-found')}</span>}
                {contractSignedAt && (
                    <span className={cn('time', [cn('found'), cn('checked')])}>
                        {t('contract-signed', { time: diffForHumans(new Date(contractSignedAt), true) })}
                    </span>
                )}
            </div>
        </div>
    );
};
