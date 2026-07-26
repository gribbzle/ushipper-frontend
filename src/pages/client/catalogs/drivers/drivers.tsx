import React, { useCallback } from 'react';
import Head from 'next/head';

import { CatalogList, CatalogPageHeader, CatalogPageLayout, DispatcherItem, getMainLayout } from '@components';
import { useDriversCatalogPage } from '@hooks';
import { DispatcherCatalogInfo } from '@store/client';
import { classname, getProjectName, translateByNamespace } from '@utils';

const cn = classname('catalog-page');
const t = translateByNamespace('client:drivers-catalog');

const DriversCatalogPage = () => {
    const { driversStats, driversResponse, isDriversResponseSuccess } = useDriversCatalogPage();
    const renderCatalogListComponent = useCallback((items: DispatcherCatalogInfo[]) => <CatalogList items={items} CatalogItem={DispatcherItem} />, []);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <CatalogPageLayout
                lastPage={driversResponse?.meta.lastPage}
                renderCatalogListComponent={renderCatalogListComponent}
                items={driversResponse?.data}
                isResponseSuccess={isDriversResponseSuccess}
                catalogStats={driversStats}
                emptyTitle={t('empty')}
            />
        </div>
    );
};

const PageHead = () => {
    const { totalDriversCount } = useDriversCatalogPage();

    return <CatalogPageHeader count={totalDriversCount} title={t('header')} />;
};

DriversCatalogPage.getLayout = getMainLayout({
    head: <PageHead />,
});

export default DriversCatalogPage;
