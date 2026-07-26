import React from 'react';

import { AttachmentsInfoColumn, ConditionsInfoColumn, DescriptionInfoColumn, JobOfferStatusInfoColumn, OfferingCompanyInfoColumn } from '@components';
import { useMeDispatcher, useMeDriver } from '@hooks';
import { JobOffer } from '@store/client';
import { classname, translateByNamespace } from '@utils';

const cn = classname('view-job-offer-drawer');
const t = translateByNamespace('client:job-offers-page.job-offer');

export const JobOfferDetails = ({ jobOffer }: { jobOffer: JobOffer }) => {
    const { status, description, attachments, offeringCompany } = jobOffer;
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();

    return (
        <div className={cn()}>
            <JobOfferStatusInfoColumn status={status} jobOffer={jobOffer} />
            <ConditionsInfoColumn jobOffer={jobOffer} />
            {description && <DescriptionInfoColumn description={description} />}
            {!!attachments.length && <AttachmentsInfoColumn files={attachments} />}
            {(isMeDispatcher || isMeDriver) && <OfferingCompanyInfoColumn company={offeringCompany} title={t('carrier-info.title')} />}
        </div>
    );
};
