import { useMemo } from 'react';

import { useParsedOrderActions } from '@/components/common/parsed-order-actions/use-parsed-order-actions';
import { useMeCarrier, useMeDispatcher, useMeDriverRelated } from '@/hooks/use-user-role-group';
import { useMeCarrierDriver } from '@/hooks/use-user-role-type';
import { useAppSelector } from '@store';
import { authorizedUserPublicIdSelector } from '@store/global';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { translateCompanyType } from '@utils/translations';

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
