import React, { useCallback } from 'react';

import { Avatar, Badge, CompanyRatingWithReviewCount } from '@/components/common';
import { UserCompany } from '@store/client';
import { classname, translateByNamespace } from '@utils';

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
