import React, { useCallback } from 'react';

import { getOrderId } from '@/utils/order';
import { CompanyRatingWithReviewCount, ContactInfo, Paper } from '@components';
import { Load } from '@store/client';
import { classname, renderProjectSpecificComponent, translateByNamespace } from '@utils';

import { BrokerDetailsBlock, CommoditiesDetailsBlock, OrderRouteDetails, PaymentInfoBlock, VehiclesDetailsBlock } from '../../common';

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
