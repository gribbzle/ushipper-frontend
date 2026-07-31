import React from 'react';

import { AttachmentsInfoColumn } from '@/components/client/job-offers/attachments-info-column/attachments-info-column';
import { ConditionsInfoColumn } from '@/components/client/job-offers/conditions-info-column/conditions-info-column';
import { DescriptionInfoColumn } from '@/components/client/job-offers/description-info-column/description-info-column';
import { JobOfferStatusInfoColumn } from '@/components/client/job-offers/job-offer-status-info-column/job-offer-status-info-column';
import { OfferingCompanyInfoColumn } from '@/components/client/job-offers/offering-company-info-column/offering-company-info-column';
import { useMeDispatcher, useMeDriver } from '@hooks';
import { JobOffer } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

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
