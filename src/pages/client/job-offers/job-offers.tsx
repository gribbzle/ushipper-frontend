import React from 'react';
import Head from 'next/head';

import { AcceptJobOfferModal } from '@/components/client/job-offers/accept-job-offer-modal/accept-job-offer-modal';
import { DeclineJobOfferModal } from '@/components/client/job-offers/decline-job-offer-modal/decline-job-offer-modal';
import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { JobOfferItem } from '@/components/client/job-offers/job-offer-item/job-offer-item';
import { JobOffersFilters } from '@/components/client/job-offers/job-offers-filters/job-offers-filters';
import { Paginate } from '@/components/common/paginate/paginate';
import { SendJobOfferDrawer } from '@/components/client/job-offers/send-job-offer-drawer/send-job-offer-drawer';
import { ViewJobOfferDrawer } from '@/components/client/job-offers/view-job-offer-drawer/view-job-offer-drawer';
import { useJobOffers } from '@hooks';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

import './job-offers.scss';

const t = translateByNamespace('client:job-offers-page');
const cn = classname('job-offers-page');

const JobOffersPage = () => {
    const {
        emptyTitle,
        emptySubTitle,
        jobOffersStats,
        jobOffersResponse,
        isJobOffersResponseSuccess,
        currentPage,
        setCurrentPage,
        filters,
        onSelectTab,
        onChangeFormValue,
    } = useJobOffers();

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <div className={cn('body')}>
                {jobOffersResponse?.data && (
                    <>
                        <JobOffersFilters filters={filters} onSelectTab={onSelectTab} offersStats={jobOffersStats} onChangeFormValue={onChangeFormValue} />
                        {!!jobOffersResponse.data.length && (
                            <div className={cn('list')}>
                                {jobOffersResponse.data.map(offer => (
                                    <JobOfferItem key={offer.publicId} jobOffer={offer} />
                                ))}
                                {jobOffersResponse.meta.lastPage > 1 && (
                                    <Paginate page={currentPage} lastPage={jobOffersResponse.meta.lastPage} onChange={setCurrentPage} />
                                )}
                            </div>
                        )}
                    </>
                )}

                {isJobOffersResponseSuccess && !jobOffersResponse?.data.length && (
                    <EmptyLayout
                        title={emptyTitle}
                        subTitle={emptySubTitle}
                        pathTo='/client/catalogs/dispatchers'
                        asPathTo='/catalogs/dispatchers'
                        buttonTitle={t('go-to-dispatchers-catalog-btn')}
                    />
                )}
            </div>
            <ViewJobOfferDrawer />
            <DeclineJobOfferModal />
            <AcceptJobOfferModal />
            <SendJobOfferDrawer />
        </div>
    );
};

const PageHead = () => <div className={cn('header')}>{t('header')}</div>;

JobOffersPage.getLayout = getMainLayout({
    head: <PageHead />,
    permissions: [
        { scope: 'carrierAdministration', functionality: 'common.administration.job_offer.view_any' },
        { scope: 'dispatcherAdministration', functionality: 'common.administration.job_offer.view_any' },
        { scope: 'driverAdministration', functionality: 'common.administration.job_offer.view_any' },
    ],
});

export default JobOffersPage;
