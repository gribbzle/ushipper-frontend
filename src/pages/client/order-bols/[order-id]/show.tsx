import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getFreeAccessLayout } from '@/components/common/free-access-layout/free-access-layout';
import { Link } from '@/components/common/link/link';
import { OrderBolDamageCode } from '@/components/client/order-bols/order-bol-damage-code/order-bol-damage-code';
import { OrderBolDetails } from '@/components/client/order-bols/order-bol-details/order-bol-details';
import { OrderBOLHeaderButtons } from '@/components/client/order-bols/order-BOL-header-buttons/order-BOL-header-buttons';
import { OrderBolVehiclesInspections } from '@/components/client/order-bols/order-bol-vehicles-inspections/order-bol-vehicles-inspections';
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
