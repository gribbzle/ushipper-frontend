import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { CompanyRatingWithReviewCount } from '@/components/common/company-rating-with-review-count/company-rating-with-review-count';
import { useShowCompanyPage } from '@hooks';
import { classname } from '@utils/classname';

import { OfferingCompanyInfoColumnProps } from './offering-company-info-column.types';

import './offering-company-info-column.scss';

const cn = classname('offering-company-info');

export const OfferingCompanyInfoColumn = ({ company, title }: OfferingCompanyInfoColumnProps) => {
    const { name, publicId } = company;
    const { handleShowCompanyPage } = useShowCompanyPage();

    return (
        <OrderItemInfoColumn title={title} className={cn()}>
            <div className={cn('details')}>
                <span className={cn('name')} onClick={() => handleShowCompanyPage(publicId)}>
                    {name}
                </span>
                <CompanyRatingWithReviewCount rating={company?.rating} reviewsTotal={company?.reviewsTotal} />
            </div>
        </OrderItemInfoColumn>
    );
};
