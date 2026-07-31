import React from 'react';
import Head from 'next/head';

import { AcceptJobOfferModal } from '@/components/client/job-offers/accept-job-offer-modal/accept-job-offer-modal';
import {
    DeclineJobOfferModal,
    EmptyLayout,
    getMainLayout,
    JobOfferItem,
    JobOffersFilters,
    Paginate,
    SendJobOfferDrawer,
    ViewJobOfferDrawer,
} from '@components';
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
