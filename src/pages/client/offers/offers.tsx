import React, { useMemo, useState } from 'react';
import Head from 'next/head';

import DeclineModal from '@/components/client/offers/decline-modal/decline-modal';
import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { OfferItem } from '@/components/client/offers/offer-item/offer-item';
import { OffersFilters } from '@/components/client/offers/offers-filters/offers-filters';
import OfferDrawer from '@/components/client/offers/offer-drawer/offer-drawer';
import { Paginate } from '@/components/common/paginate/paginate';
import { OffersListTabsEnum } from '@/enums/offers-list-tabs-enum';
import { useMeShipper, useUserRoleGroup } from '@/hooks/use-user-role-group';
import { OffersStatistic, useGetOffersQuery, useGetOffersStatisticQuery } from '@store/api/order-offers';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';
import { useOffersFilters } from '@/components/client/offers/offers-filters/use-offer-filters';

import './offers.scss';

const cn = classname('offers-page');
const t = translateByNamespace('client:order-offers');
const filtersTranslate = translateByNamespace('client:order-offers:filters');

const OffersPage = () => {
    const isShipper = useMeShipper();
    const userRoleGroup = useUserRoleGroup();
    const [currentPage, setCurrentPage] = useState(1);

    const { filters, onSelectTab, onChangeFormValue } = useOffersFilters();

    const { data: offersResponse, isSuccess } = useGetOffersQuery({
        page: currentPage,
        perPage: 20,
        ...filters,
    });

    const offersStatsResponse = useGetOffersStatisticQuery({
        shipperCompanyId: filters.shipperCompanyId,
        carrierCompanyId: filters.carrierCompanyId,
        searchQuery: filters.searchQuery,
        searchSubject: filters.searchSubject,
    });

    const offersStats = useMemo<{ all: number } & OffersStatistic>(() => {
        if (!offersStatsResponse.data) {
            return {
                [OffersListTabsEnum.New]: 0,
                [OffersListTabsEnum.Accepted]: 0,
                [OffersListTabsEnum.Declined]: 0,
                [OffersListTabsEnum.Canceled]: 0,
                [OffersListTabsEnum.All]: 0,
            };
        }

        return offersStatsResponse.data;
    }, [offersStatsResponse]);

    return (
        <div className={cn()}>
            <Head>
                <title>{`Offers Management | ${getProjectName()}`}</title>
            </Head>
            {offersResponse?.data && (
                <div className={cn('list')}>
                    <OffersFilters filters={filters} onSelectTab={onSelectTab} offersStats={offersStats} onChangeFormValue={onChangeFormValue} />
                    {offersResponse.data.map(offer => (
                        <OfferItem key={offer.publicId} offer={offer} />
                    ))}
                    {offersResponse.meta.lastPage > 1 && <Paginate page={currentPage} lastPage={offersResponse.meta.lastPage} onChange={setCurrentPage} />}
                </div>
            )}
            <div className={cn('empty-list')}>
                {isSuccess && !offersResponse.data.length && !Object.values(filters).filter(el => !!el) && (
                    <EmptyLayout
                        title={t(`${userRoleGroup}-empty-title`, { status: '' })}
                        subTitle={t(`${userRoleGroup}-empty-sub-title`, { status: '' })}
                        pathTo='/client/loadboard'
                        asPathTo='/available-orders'
                        buttonTitle={t('link-btn-to-lb')}
                    />
                )}
                {isSuccess && !offersResponse.data.length && Object.values(filters).filter(el => !!el) && (
                    <EmptyLayout
                        title={
                            filters.status
                                ? t(`${userRoleGroup}-empty-title`, {
                                      status: filtersTranslate(`${isShipper ? 'shipper-' : ''}${filters.status}`),
                                  })
                                : t(`${userRoleGroup}-empty-title`, { status: '' })
                        }
                        subTitle={t(`${userRoleGroup}-empty-sub-title`)}
                        pathTo='/client/loadboard'
                        asPathTo='/available-orders'
                        buttonTitle={t('link-btn-to-lb')}
                    />
                )}
            </div>
            <OfferDrawer />
            <DeclineModal />
        </div>
    );
};

OffersPage.getLayout = getMainLayout({
    head: 'Offers',
    permissions: [
        { scope: 'carrierOrders', functionality: 'carrier.orders.offers.view_any' },
        { scope: 'shipperOrders', functionality: 'shipper.my_orders.offers.view_any' },
    ],
});

export default OffersPage;
