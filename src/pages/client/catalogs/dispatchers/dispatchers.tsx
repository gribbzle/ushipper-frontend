import React, { useCallback } from 'react';
import Head from 'next/head';

import { CatalogList } from '@/components/client/catalogs/catalog-list/catalog-list';
import { CatalogPageHeader } from '@/components/client/catalogs/catalog-page-header/catalog-page-header';
import { CatalogPageLayout } from '@/components/client/catalogs/catalog-page-layout/catalog-page-layout';
import { DispatcherItem } from '@/components/client/catalogs/catalog-item/catalog-item';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { useDispatchersCatalogPage } from '@hooks';
import { DispatcherCatalogInfo } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { getProjectName } from '@utils/translate/get-project-name';

const cn = classname('catalog-page');
const t = translateByNamespace('client:dispatchers-catalog');

const DispatchersCatalogPage = () => {
    const { dispatchersStats, dispatchersResponse, isDispatchersResponseSuccess } = useDispatchersCatalogPage();
    const renderCatalogListComponent = useCallback((items: DispatcherCatalogInfo[]) => <CatalogList items={items} CatalogItem={DispatcherItem} />, []);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <CatalogPageLayout
                lastPage={dispatchersResponse?.meta.lastPage}
                renderCatalogListComponent={renderCatalogListComponent}
                items={dispatchersResponse?.data}
                isResponseSuccess={isDispatchersResponseSuccess}
                catalogStats={dispatchersStats}
                emptyTitle={t('empty')}
            />
        </div>
    );
};

const PageHead = () => {
    const { totalDispatcherCount } = useDispatchersCatalogPage();

    return <CatalogPageHeader count={totalDispatcherCount} title={t('header')} />;
};

DispatchersCatalogPage.getLayout = getMainLayout({
    head: <PageHead />,
});

export default DispatchersCatalogPage;
