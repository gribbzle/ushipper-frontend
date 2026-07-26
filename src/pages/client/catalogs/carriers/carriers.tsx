import React, { useCallback } from 'react';
import Head from 'next/head';

import { CarrierItem, CatalogList, CatalogPageHeader, CatalogPageLayout, getMainLayout } from '@components';
import { useCarriersCatalogPage } from '@hooks';
import { CarriersCatalogInfo } from '@store/client';
import { classname, getProjectName, translateByNamespace } from '@utils';

const cn = classname('catalog-page');
const t = translateByNamespace('client:carriers-catalog');

const CarriersCatalogPage = () => {
    const { carriersStats, carriersResponse, isCarriersResponseSuccess } = useCarriersCatalogPage();
    const renderCatalogListComponent = useCallback((items: CarriersCatalogInfo[]) => <CatalogList items={items} CatalogItem={CarrierItem} />, []);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <CatalogPageLayout
                lastPage={carriersResponse?.meta.lastPage}
                renderCatalogListComponent={renderCatalogListComponent}
                items={carriersResponse?.data}
                isResponseSuccess={isCarriersResponseSuccess}
                catalogStats={carriersStats}
                emptyTitle={t('empty')}
            />
        </div>
    );
};

const PageHead = () => {
    const { totalCarriersCount } = useCarriersCatalogPage();

    return <CatalogPageHeader count={totalCarriersCount} title={t('header')} />;
};

CarriersCatalogPage.getLayout = getMainLayout({
    head: <PageHead />,
});

export default CarriersCatalogPage;
