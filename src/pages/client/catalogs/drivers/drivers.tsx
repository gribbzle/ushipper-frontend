import React, { useCallback } from 'react';
import Head from 'next/head';

import { CatalogList } from '@/components/client/catalogs/catalog-list/catalog-list';
import { CatalogPageHeader } from '@/components/client/catalogs/catalog-page-header/catalog-page-header';
import { CatalogPageLayout } from '@/components/client/catalogs/catalog-page-layout/catalog-page-layout';
import { DispatcherItem } from '@/components/client/catalogs/catalog-item/catalog-item';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useDriversCatalogPage } from '@/hooks/catalogs/use-drivers-catalog-page';
import { DispatcherCatalogInfo } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

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
