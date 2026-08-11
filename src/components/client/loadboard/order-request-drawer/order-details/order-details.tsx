import React, { useCallback } from 'react';

import { CompanyRatingWithReviewCount } from '@/components/common/company-rating-with-review-count/company-rating-with-review-count';
import { ContactInfo } from '@/components/common/contact-info/contact-info';
import { Paper } from '@/components/common/paper/paper';
import { getOrderId } from '@/utils/order';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { BrokerDetailsBlock } from '@/components/client/loadboard/common/broker-details-block/broker-details-block';
import { CommoditiesDetailsBlock } from '@/components/client/loadboard/common/commodities-details-block/commodities-details-block';
import { OrderRouteDetails } from '@/components/client/loadboard/common/order-route-details/order-route-details';
import { PaymentInfoBlock } from '@/components/client/loadboard/common/payment-info-block/payment-info-block';
import { VehiclesDetailsBlock } from '@/components/client/loadboard/common/vehicles-details-block/vehicles-details-block';

import './order-details.scss';

const cn = classname('order-details');
const t = translateByNamespace('client:loadboard:load-details');

type Props = {
    order: Load;
};

export const OrderDetails = ({ order }: Props) => {
    const { vehicles, commodities, paymentInformation, company, drivingDistance } = order;

    const handleShowCompanyPage = useCallback(() => {
        const aliasPath = `/companies/${company.publicId}`;

        window.open(aliasPath, '_blank');
    }, [company.publicId]);

    return (
        <Paper
            className={cn()}
            headerClassName={cn('header')}
            header={t('title')}
            bodyClassName={cn('body')}
            body={
                <>
                    <span className={cn('order-id')}>{t('order-id', { orderId: getOrderId(order) })}</span>
                    <OrderRouteDetails order={order} />
                    {renderProjectSpecificComponent(
                        {
                            VehiclesDetailsBlock: <VehiclesDetailsBlock vehicles={vehicles} />,
                            CommoditiesDetailsBlock: <CommoditiesDetailsBlock commodities={commodities} />,
                        },
                        'loadboardProductsDetailsBlock',
                    )}
                    <PaymentInfoBlock paymentInformation={paymentInformation} drivingDistance={drivingDistance} vehicles={vehicles} commodities={commodities} />
                    <BrokerDetailsBlock>
                        {order.company && (
                            <>
                                <span className={cn('broker-name')} onClick={handleShowCompanyPage}>
                                    {order.company.name}
                                </span>
                                <CompanyRatingWithReviewCount rating={order.company?.rating} reviewsTotal={order.company?.reviewsTotal} />
                                <ContactInfo
                                    information={{
                                        email: order.company.contact?.emails || '',
                                        phone: order.company.contact?.phones || '',
                                        name: order.company.contact?.names,
                                    }}
                                />
                            </>
                        )}
                    </BrokerDetailsBlock>
                </>
            }
        />
    );
};
