import React, { useCallback } from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { Badge } from '@/components/common/badge/badge';
import { CompanyRatingWithReviewCount } from '@/components/common/company-rating-with-review-count/company-rating-with-review-count';
import { UserCompany } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './user-company-info.scss';

const t = translateByNamespace('client:order:order-information');
const cn = classname('user-company-info');

type Props = {
    company: UserCompany;
};

export const UserCompanyInfo = ({ company }: Props) => {
    const handleShowCompanyPage = useCallback(() => {
        const aliasPath = `/companies/${company.publicId}`;

        window.open(aliasPath, '_blank');
    }, [company.publicId]);

    return (
        <OrderInfoDetailsWrapper title={t(company.type)} className={cn()}>
            <Badge size='mini'>
                <Avatar src={company.owner.avatar?.url} />
            </Badge>
            <div>
                <div className={cn('username')}>{company.owner.name}</div>
                <div className={cn('description')} onClick={handleShowCompanyPage}>
                    <span>{company.name}</span>
                    <CompanyRatingWithReviewCount rating={company?.rating} reviewsTotal={company?.reviewsTotal} />
                </div>
            </div>
        </OrderInfoDetailsWrapper>
    );
};
