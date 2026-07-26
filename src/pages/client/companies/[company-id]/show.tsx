import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cleanDeep from 'clean-deep';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { ReviewReplyDrawer } from '@/components/client/company/review-reply-drawer';
import { OrderSortingDirection, ReviewTabsEnum } from '@/enums';
import {
    CompanyAvgDetailsRatingPaper,
    CompanyBriefPaper,
    CompanyContactInfoPaper,
    CompanyFMCSAInfo,
    CompanyInfo,
    CompanyOverallRatingPaper,
    CompanyReviewFilters,
    CompanyStaticticsChartBlock,
    DispatcherInfo,
    getAllFiltersFromUrlParams,
    getMainLayout,
    getReviewsFiltersFromUrlParams,
    Paginate,
    Paper,
    ReviewFiltersFormState,
    ReviewFiltersTabFromUrlParams,
    ReviewsList,
    ReviewsNoData,
    SendJobOfferDrawer,
} from '@components';
import { useIsDispatcherOwnerPage, useIsDriverOwnerPage } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { fetchCompanyAction, fetchedCompanySelector } from '@store/admin';
import { companiesActions } from '@store/admin/companies/slice';
import { useGetCompanyRatingQuery } from '@store/api/company-api';
import { GetReviewData, useGetReviewsQuery } from '@store/api/review';
import { classname, isClientSide, translateByNamespace } from '@utils';

import CompanyPageHead from './company-page-head';

import './show.scss';

const cn = classname('show-company-page');
const t = translateByNamespace('client:company-page');

const EmptyBlock = () => <Paper className={cn()} body={<div className={cn('empty-block')}>{t('no-company-text')}</div>} />;

const ShowCompanyPage = () => {
    const [page, setPage] = useState(1);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const allUrlParams = getAllFiltersFromUrlParams(router.query);
    const reviewsFilters = getReviewsFiltersFromUrlParams(router.query);
    const initialFormFiltersRef = useRef<ReviewFiltersFormState>(allUrlParams);
    const companyId = router.query['company-id'] as string;
    const company = useAppSelector(fetchedCompanySelector);

    const { data: rating } = useGetCompanyRatingQuery(companyId);

    const reviewsFilterParams = useMemo<GetReviewData>(() => {
        const defaultReviewsData: GetReviewData = {
            page: 1,
            perPage: 20,
            orderDirection: OrderSortingDirection.ASC,
        };

        return { ...defaultReviewsData, page, companyId, ...reviewsFilters };
    }, [page, companyId, reviewsFilters]);

    const { data: reviewsPaginatedData, isLoading, isError: reviewsError } = useGetReviewsQuery(reviewsFilterParams);

    useEffect(() => {
        if (!companyId) return;

        dispatch(fetchCompanyAction(companyId));
        if (rating) {
            dispatch(companiesActions.setCompanyRating(rating));
        }

        if (reviewsError) {
            toast.error<string>(t('notification.reviews-error-text'));
        }
    }, [dispatch, companyId, rating, reviewsError]);

    const applyQueryParams = useCallback(
        (query: ReviewFiltersFormState) => {
            const newQuery = { ...router.query, ...query };

            router.replace(
                {
                    pathname: router.pathname,
                    query: newQuery,
                },
                {
                    pathname: router.asPath.split('?')[0],
                    query: query,
                },
                { shallow: true },
            );
        },
        [router],
    );

    const handleFiltersChange = useCallback(
        (filters: ReviewFiltersFormState) => {
            if (isClientSide()) {
                const { tabStatus } = router.query as ReviewFiltersTabFromUrlParams;
                const query: ReviewFiltersTabFromUrlParams = cleanDeep({ tabStatus, ...filters });

                applyQueryParams(query);
            }
        },
        [applyQueryParams, router.query],
    );

    const handleTabFilterClick = useCallback(
        (value: ReviewTabsEnum) => {
            const query: ReviewFiltersTabFromUrlParams = {
                tabStatus: value,
            };

            applyQueryParams(query);
        },
        [applyQueryParams],
    );

    const showRatingPanel = allUrlParams.tabStatus === ReviewTabsEnum.RATINGS;
    const showNoData = showRatingPanel && !reviewsPaginatedData?.data.length && !isLoading;
    const showReviewList = showRatingPanel && reviewsPaginatedData && reviewsPaginatedData.data.length > 0;
    const showPaginator = showRatingPanel && reviewsPaginatedData && reviewsPaginatedData.meta.lastPage !== 1;

    const isDispatcherOwnerPage = useIsDispatcherOwnerPage();
    const isDriverOwnerPage = useIsDriverOwnerPage();

    return (
        <div className={cn()}>
            {company ? (
                <div className={cn('wrapper')}>
                    <div className={cn('column', ['total-info'])}>
                        <CompanyBriefPaper company={company} isAdditionalInfoNeeded={true} />
                        {showRatingPanel && (
                            <>
                                <CompanyOverallRatingPaper />
                                <CompanyAvgDetailsRatingPaper />
                            </>
                        )}
                    </div>
                    <div className={cn('column', ['details-info'])}>
                        <CompanyReviewFilters
                            initialFilters={initialFormFiltersRef.current}
                            onFiltersChange={handleFiltersChange}
                            onTabFilterClick={handleTabFilterClick}
                            initialTabFilter={allUrlParams.tabStatus}
                            reviewCounter={reviewsPaginatedData?.meta.total}
                        />
                        {allUrlParams.tabStatus !== ReviewTabsEnum.RATINGS &&
                            (isDispatcherOwnerPage || isDriverOwnerPage ? (
                                <DispatcherInfo />
                            ) : (
                                <div className={cn('overview')}>
                                    <div className={cn('overview-left-column')}>
                                        <CompanyInfo />
                                        <CompanyContactInfoPaper />
                                    </div>
                                    <CompanyFMCSAInfo />
                                </div>
                            ))}
                        {showNoData && <ReviewsNoData />}
                        {showReviewList && <ReviewsList reviews={reviewsPaginatedData.data} />}
                        {showPaginator && (
                            <Paginate lastPage={reviewsPaginatedData.meta.lastPage} page={reviewsPaginatedData.meta.currentPage} onChange={setPage} />
                        )}
                        {(isDriverOwnerPage || isDispatcherOwnerPage) && (
                            <>
                                <CompanyStaticticsChartBlock type='gross' />
                                <CompanyStaticticsChartBlock type='avg-mile-cost' />
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <EmptyBlock />
            )}
            <ReviewReplyDrawer />
            <SendJobOfferDrawer />
        </div>
    );
};

ShowCompanyPage.getLayout = getMainLayout({
    head: <CompanyPageHead />,
});

export default ShowCompanyPage;
