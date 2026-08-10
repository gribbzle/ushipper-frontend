import React from 'react';

import { DispatcherPersonalInfo } from '@/components/client/catalogs/common/dispatcher-personal-info/dispatcher-personal-info';
import { Paper } from '@/components/common/paper/paper';
import { useMeCarrier, useMeDispatcher, useMeDriver } from '@/hooks/use-user-role-group';
import { useGetUserQuery } from '@store/api/users-api';
import { JobOffer } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ConditionsInfoColumn } from '../conditions-info-column';
import { DispatcherDetailsInfoColumn } from '../dispatcher-details-info-column';
import { JobOfferActionsColumn } from '../job-offer-actions-column';
import { JobOfferStatusInfoColumn } from '../job-offer-status-info-column';
import { OfferingCompanyInfoColumn } from '../offering-company-info-column';

import './job-offer-item.scss';

const cn = classname('job-offer-item');
const t = translateByNamespace('client:job-offers-page.job-offer');

export const JobOfferItem = ({ jobOffer }: { jobOffer: JobOffer }) => {
    const { offeringCompany, status, receiver } = jobOffer;
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();
    const isMeCarrier = useMeCarrier();

    const { data: dispatcher } = useGetUserQuery(
        { id: receiver.publicId || '' },
        {
            skip: !receiver?.publicId,
        },
    );

    return (
        <Paper
            bodyClassName={cn()}
            body={
                <>
                    <div className={cn('content')}>
                        {(isMeDispatcher || isMeDriver) && (
                            <div className={cn('offering-info')}>
                                <OfferingCompanyInfoColumn company={offeringCompany} title={t('carrier-info.title')} />
                                <ConditionsInfoColumn jobOffer={jobOffer} />
                            </div>
                        )}
                        {isMeCarrier && dispatcher && (
                            <div className={cn('dispatcher-info')}>
                                <DispatcherPersonalInfo roleType={dispatcher?.roleType} dispatcher={dispatcher} companyPublicId={dispatcher.companyPublicId} />
                                <DispatcherDetailsInfoColumn dispatcher={dispatcher} />
                            </div>
                        )}
                        <JobOfferStatusInfoColumn status={status} jobOffer={jobOffer} />
                    </div>

                    <JobOfferActionsColumn jobOffer={jobOffer} />
                </>
            }
        />
    );
};
