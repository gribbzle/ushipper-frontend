import React, { useCallback } from 'react';
import Head from 'next/head';

import { CatalogList, CatalogPageHeader, CatalogPageLayout, DispatcherItem, getMainLayout } from '@components';
import { useDispatchersCatalogPage } from '@hooks';
import { DispatcherCatalogInfo } from '@store/client';
import { classname, getProjectName, translateByNamespace } from '@utils';

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
