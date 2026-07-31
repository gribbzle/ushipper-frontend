import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getFreeAccessLayout, Link, OrderBolDamageCode, OrderBolDetails, OrderBOLHeaderButtons, OrderBolVehiclesInspections } from '@components';
import { useAppSelector } from '@store';
import { useGetOrderBolQuery } from '@store/api/order-bol-api';
import { OrderBOLSelector } from '@store/client/order-BOL';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';
import { getProjectName } from '@utils/translate/get-project-name';

import './show.scss';

const cn = classname('show-order-bol-page');
const t = translateByNamespace('client:order-BOL-page');

const ShowOrderBOLPage = () => {
    const router = useRouter();
    const orderId = router.query['order-id'] as string;
    const orderBOL = useAppSelector(OrderBOLSelector);

    useGetOrderBolQuery({ orderId }, { skip: !orderId });

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            {orderBOL && (
                <>
                    <OrderBolDetails className={cn('order-details-paper')} />
                    {renderProjectSpecificComponent(
                        {
                            OrderBolVehiclesInspections: <OrderBolVehiclesInspections />,
                            OrderBolCommoditiesInspections: <></>,
                        },
                        'orderBolProductsInspections',
                    )}
                    <OrderBolDamageCode />
                </>
            )}
            <div className={cn('footer')}>
                <span>{t('powered-by')}</span> <Link href='#'>{t('ushipper-us')}</Link>
            </div>
        </div>
    );
};

ShowOrderBOLPage.getLayout = getFreeAccessLayout({ title: t('header-title'), actions: <OrderBOLHeaderButtons /> });

export default ShowOrderBOLPage;
