import React from 'react';

import { useMeCarrier } from '@hooks';
import { JobOffer } from '@store/client';
import { classname } from '@utils/classname';

import { JobOfferActionsInfo } from './job-offer-actions-info';
import { JobOfferItemActions } from './job-offer-item-actions';

import './job-offer-actions-column.scss';

const cn = classname('job-offer-actions');

export const JobOfferActionsColumn = ({
    jobOffer: { offeringCompany, receiver, creator, createdAt, acceptedAt, status, type, declinedAt, publicId },
}: {
    jobOffer: JobOffer;
}) => {
    const isMeCarrier = useMeCarrier();

    return (
        <div className={cn('', { 'justify--center': isMeCarrier })}>
            <JobOfferItemActions jobOfferPublicId={publicId} />
            <JobOfferActionsInfo info={{ offeringCompany, receiver, creator, createdAt, acceptedAt, status, declinedAt, type }} />
        </div>
    );
};
