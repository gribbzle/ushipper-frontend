import React, { useMemo } from 'react';

import { CompanyLogo } from '@/components/client/company/company-logo/company-logo';
import { CompanyFeesInfo } from '@/components/common/table/common/company-fees-info/company-fees-info';
import { CompanyStatusInfo } from '@/components/common/table/common/company-status-info/company-status-info';
import { Link } from '@/components/common/link/link';
import { Tag } from '@/components/common/tag/tag';
import { GroupIcon, TruckIcon } from '@/components/common/main-layout/sidebar/icons';
import { TotalRatingBlock } from '@/components/common/total-rating-block';
import { CompanyStatusEnum } from '@/enums/company-status-enum';
import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { PROJECT_KEY_NAME } from '@constants';
import { useCarriersActionsPermission } from '@/hooks/accounting/use-carriers-actions-permission';
import { Company } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { numberWithCommas } from '@utils/numbers';
import { isFreightX } from '@utils/project-config';

import { CompanyActionsCard } from '../company-actions-card';

import './company-info-card.scss';
import CheckGearIcon from '@/assets/icons/check-gear-icon.svg';
import MoneyBagIcon from '@/assets/icons/money-bag.svg';
import NoPhotoIcon from '@/assets/icons/no-photo-icon.svg';

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
