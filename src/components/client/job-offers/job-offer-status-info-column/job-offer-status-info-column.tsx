import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

import { JobOfferStatusInfoColumnProps } from './job-offer-status-info-column.types';
import { JobOfferStatusTag } from './job-offer-status-tag';
import { useJobOfferStatusInfoColumn } from './use-job-offer-status-info-column';

import './job-offer-status-info-column.scss';

const cn = classname('job-offer-status-info');
const t = translateByNamespace('client:job-offers-page.job-offer.offer-status');
const tJobOfferStatus = translateByNamespace('client:order-offers:filters');

export const JobOfferStatusInfoColumn = ({ status, jobOffer }: JobOfferStatusInfoColumnProps) => {
    const { time } = useJobOfferStatusInfoColumn(status, jobOffer);
    const isMeCarrier = useMeCarrier();

    return (
        <OrderItemInfoColumn title={t('title')} className={cn('', { 'justify--center': isMeCarrier })}>
            <JobOfferStatusTag view={status}>{tJobOfferStatus(`${isMeCarrier ? 'shipper-' : ''}${status}`)}</JobOfferStatusTag>
            {time && <div className={cn('date')}>{diffForHumans(new Date(time))}</div>}
        </OrderItemInfoColumn>
    );
};
