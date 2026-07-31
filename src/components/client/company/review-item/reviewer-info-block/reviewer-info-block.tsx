import React, { useCallback } from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders';
import { CreatorCompanyInfo } from '@/shared';
import { convertCityToAbbreviation } from '@/utils/converter';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './reviewer-info-block.scss';

type Props = {
    company: CreatorCompanyInfo;
};

const t = translateByNamespace('client:company-page:reply');
const translateCompanyTypes = translateByNamespace('common:company-types');
const cn = classname('reviewer-info-block');

export const ReviewerInfoBlock = ({ company }: Props) => {
    const { reviewsCompleted, type, name, city, state, publicId } = company;

    const handleShowCompanyPage = useCallback(() => {
        const aliasPath = `/companies/${publicId}`;

        window.open(aliasPath, '_blank');
    }, [publicId]);

    return (
        <OrderItemInfoColumn title={translateCompanyTypes(type)} className={cn()}>
            <h4 onClick={handleShowCompanyPage} className={cn('name')}>
                {name}
            </h4>
            {city && <span className={cn('city')}>{`${city}, ${convertCityToAbbreviation(state)}`}</span>}

            <span className={cn('label')}>
                {t(`${reviewsCompleted > 1 ? 'reviews-completed-label-plural' : 'reviews-completed-label'}`, { count: reviewsCompleted })}
            </span>
        </OrderItemInfoColumn>
    );
};
