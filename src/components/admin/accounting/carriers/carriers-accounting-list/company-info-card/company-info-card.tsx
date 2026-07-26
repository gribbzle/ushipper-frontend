import React, { useMemo } from 'react';

import { CompanyLogo } from '@/components/client';
import { CompanyFeesInfo, CompanyStatusInfo, Link, Tag } from '@/components/common';
import { GroupIcon, TruckIcon } from '@/components/common/main-layout/sidebar/icons';
import { TotalRatingBlock } from '@/components/common/total-rating-block';
import { CompanyStatusEnum, FeeCategoryTermType } from '@/enums';
import { PROJECT_KEY_NAME } from '@constants';
import { useCarriersActionsPermission } from '@hooks';
import { CheckGearIcon, MoneyBagIcon, NoPhotoIcon } from '@icons';
import { Company } from '@store/admin';
import { classname, isFreightX, numberWithCommas, translateByNamespace } from '@utils';

import { CompanyActionsCard } from '../company-actions-card';

import './company-info-card.scss';

const cn = classname('company-info-card');
const t = translateByNamespace('admin:accounting:company-card-info');

export const CompanyInfoCard = (company: Company) => {
    const {
        logo,
        name,
        isPartner,
        status,
        usdotNumber,
        rating,
        reviewsTotal,
        owner: { name: ownerName },
        phone,
        email,
        fees,
        publicId,
        usersCount,
        ordersCount,
        totalGross,
    } = company;
    const hasCarriersActionsPermission = useCarriersActionsPermission();

    const delayedTermsFees = useMemo(() => fees.filter(({ termType }) => termType === FeeCategoryTermType.DELAYED), [fees]);
    const instantFees = useMemo(() => fees.filter(({ termType }) => termType === FeeCategoryTermType.INSTANT), [fees]);

    return (
        <div className={cn()}>
            <div>
                <div className={cn('main')}>
                    <div className={cn('logo')}>{logo?.url ? <CompanyLogo logoUrl={logo.url} /> : <NoPhotoIcon />}</div>
                    <h4>
                        <span>{name}</span>
                        {isPartner && <CheckGearIcon />}
                        <CompanyStatusInfo companyStatus={status as CompanyStatusEnum} />
                    </h4>
                    <div className={cn('main-tags')}>
                        <Tag type='gray'>{t('carrier-type')}</Tag>
                        {isPartner && <Tag type='primary'>{t('ushipper-partner')}</Tag>}
                        {usdotNumber && <span className={cn('usdot')}>{t('usdot', { usdot: usdotNumber })}</span>}
                    </div>
                    <TotalRatingBlock rating={rating} reviewsTotal={reviewsTotal} />
                </div>
                <div className={cn('contacts')}>
                    <h4>{t('contacts:title')}</h4>
                    <p>{ownerName}</p>
                    {phone && <p title={phone}>{t('contacts:phone', { phone })}</p>}
                    {email && <p title={email}>{t('contacts:email', { email })}</p>}
                </div>
                <div className={cn('fees')}>
                    <h4>{t(`fees-types:${PROJECT_KEY_NAME}-delayed-terms`)}</h4>
                    <CompanyFeesInfo fees={delayedTermsFees} showTitle={false} />
                </div>
                {!isFreightX && (
                    <div className={cn('fees')}>
                        <h4>{t('fees-types:cod-cop')}</h4>
                        <CompanyFeesInfo fees={instantFees} showTitle={false} />
                    </div>
                )}
                {hasCarriersActionsPermission && <CompanyActionsCard {...company} />}
            </div>
            <div className={cn('counters')}>
                <div>
                    <h4>
                        <GroupIcon />
                        <span>{t('counters:users')}</span>
                    </h4>
                    <p>
                        <Link href={{ pathname: '/admin/users', query: { companyName: name } }} target='_blank'>
                            {numberWithCommas(usersCount)}
                        </Link>
                    </p>
                </div>
                <div>
                    <h4>
                        <TruckIcon />
                        <span>{t('counters:orders')}</span>
                    </h4>
                    <p>
                        <Link href={{ pathname: '/admin/orders/carrier', query: { companyPublicId: publicId } }}>{numberWithCommas(ordersCount)}</Link>
                    </p>
                </div>
                <div>
                    <h4>
                        <MoneyBagIcon />
                        <span>{t('counters:total-gross')}</span>
                    </h4>
                    <p>${numberWithCommas(totalGross)}</p>
                </div>
            </div>
        </div>
    );
};
