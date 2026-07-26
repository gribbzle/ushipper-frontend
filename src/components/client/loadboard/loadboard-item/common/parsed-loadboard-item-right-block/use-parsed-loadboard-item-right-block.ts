import { useMemo } from 'react';

import { useParsedOrderActions } from '@components';
import { useMeCarrier, useMeCarrierDriver, useMeDispatcher, useMeDriverRelated } from '@hooks';
import { useAppSelector } from '@store';
import { authorizedUserPublicIdSelector } from '@store/global';
import { diffForHumans, translateByNamespace, translateCompanyType } from '@utils';

import { LoadboardItemProps } from '../../loadboard-item.types';
import { getOrderSource } from '../parsed-loadboard-item-payment-block/utils';

const t = translateByNamespace('client:loadboard:item');

export const useParsedLoadboardItemRightBlock = ({ order, loadBoardFilters }: Omit<LoadboardItemProps, 'tagged'>) => {
    const { source, latestRequest, driverRequests } = order;
    const authorizedUserPublicId = useAppSelector(authorizedUserPublicIdSelector);

    const isMeCarrierDriver = useMeCarrierDriver();
    const isMeDispatcher = useMeDispatcher();
    const isMeCarrier = useMeCarrier();
    const isDriver = useMeDriverRelated();

    const dispatcherInfo = useMemo(() => {
        if (!latestRequest) {
            return '';
        }

        const { name, publicId } = latestRequest.creator;

        if (publicId === authorizedUserPublicId) {
            return t('dispatcher-request-to-info', { name: source ? getOrderSource(source) : translateCompanyType('shipper') });
        }

        return t('dispatcher-request-by-info', { name, time: diffForHumans(new Date(latestRequest.createdAt), true) });
    }, [latestRequest, source, authorizedUserPublicId]);

    const isForDriverRequestInfo = useMemo(() => isDriver && driverRequests, [isDriver, driverRequests]);

    const isForDispatcherInfo = useMemo(() => isMeDispatcher || (isMeCarrier && !isMeCarrierDriver), [isMeDispatcher, isMeCarrier, isMeCarrierDriver]);

    const { showCheckContractButton } = useParsedOrderActions({ order, loadBoardFilters });

    return {
        isForDriverRequestInfo,
        isForDispatcherInfo,
        showCheckContractButton,
        dispatcherInfo,
    };
};
