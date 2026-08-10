import React, { ReactNode, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { useCompanyTypeAddressBlock } from '@/components/client/catalogs/common/company-type-address-block/use-company-type-address-block';
import { CompanyBriefActions } from '@/components/client/company/company-brief-actions/company-brief-actions';
import { CompanyBriefStatistics } from '@/components/client/company/company-brief-statistics/company-brief-statistics';
import { CompanyLogo } from '@/components/client/company/company-logo/company-logo';
import { CompanyTotalRatingInfo } from '@/components/client/company/company-total-rating-info/company-total-rating-info';
import { Avatar } from '@/components/common/avatar/avatar';
import { DispatcherLanguages } from '@/components/common/dispatcher-languages/dispatcher-languages';
import { Tag } from '@/components/common/tag/tag';
import { Paper } from '@/components/common/paper/paper';
import { useIsDispatcherOwnerPage, useIsDriverOwnerPage } from '@/hooks/catalogs/use-type-company-owner';
import { useIsRatingPanel } from '@/hooks/use-is-rating-panel';
import { Company } from '@store/admin';
import { useGetUserQuery } from '@store/api/users-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { DispatcherStats } from '../../dispatcher-stats';

import { useHasBriefActions } from './use-has-brief-actions';

import './company-brief-paper.scss';
import CheckGearIcon from '@/assets/icons/check-gear-icon.svg';
import GeoLocationIcon from '@/assets/icons/geolocation-icon.svg';

type CompanyBriefPaperProps = {
    company: Company;
    isAdditionalInfoNeeded?: boolean;
};

type RowProps = {
    children: ReactNode;
    className: string;
};

const translateCompanyTypes = translateByNamespace('common:company-types');
const translateBusinessHours = translateByNamespace('common:working-time');
const cn = classname('company-brief-paper');

const Row = ({ children, className }: RowProps) => <div className={cn('row', [className])}>{children}</div>;

export const CompanyBriefPaper = ({ company, isAdditionalInfoNeeded }: CompanyBriefPaperProps) => {
    const { type, logo, name, city, state, rating, reviewsTotal, owner, publicId } = company;

    const isDispatcherOwnerPage = useIsDispatcherOwnerPage();
    const isDriverOwnerPage = useIsDriverOwnerPage();

    const isDispatcherOrDriverPage = useMemo(() => isDispatcherOwnerPage || isDriverOwnerPage, [isDispatcherOwnerPage, isDriverOwnerPage]);

    const { data: user } = useGetUserQuery({ id: company?.owner?.publicId }, { skip: !company?.owner });

    const isFlagged = useMemo(() => (user ? user.isFlagged : company.isFlagged), [company.isFlagged, user]);

    const isRatingPanel = useIsRatingPanel();
    const { hasBriefActions } = useHasBriefActions();

    const logoUrl = useMemo(() => (isDispatcherOrDriverPage ? user?.avatar?.url : logo?.url), [isDispatcherOrDriverPage, logo, user]);
    const companyName = useMemo(() => (isDispatcherOrDriverPage ? user?.name : name), [isDispatcherOrDriverPage, name, user]);
    const { address } = useCompanyTypeAddressBlock({ city, state });
    const { address: userAddress } = useCompanyTypeAddressBlock({ city: user?.city, state: user?.state });

    const body = useMemo(
        () => (
            <div className={cn('content')}>
                {isDispatcherOrDriverPage && <Avatar src={logoUrl} className={cn('avatar')} />}
                {!isDispatcherOrDriverPage && logoUrl && <CompanyLogo logoUrl={logoUrl} />}
                <div className={cn('info-wrapper')}>
                    {companyName && (
                        <Row className={cn('name')}>
                            {companyName}
                            <CheckGearIcon />
                        </Row>
                    )}
                    <div className={cn('details')}>
                        <Tag type='gray' size='round'>
                            {translateCompanyTypes(type)}{' '}
                        </Tag>
                        {userAddress ? (
                            <Row className={cn('address')}>
                                <GeoLocationIcon />
                                {userAddress}
                            </Row>
                        ) : (
                            address && (
                                <Row className={cn('address')}>
                                    <GeoLocationIcon />
                                    {address}
                                </Row>
                            )
                        )}
                    </div>
                    <CompanyTotalRatingInfo rating={rating} reviewsTotal={reviewsTotal} />
                    {isAdditionalInfoNeeded && (
                        <>
                            {isDispatcherOrDriverPage && user ? (
                                <>
                                    <div className={cn('hours')}>{translateBusinessHours(toKebabCase(user.businessHours))}</div>
                                    {isRatingPanel && (
                                        <>
                                            {!!user.communicationLanguages?.length && (
                                                <div className={cn('languages')}>
                                                    <DispatcherLanguages languages={user.communicationLanguages} />
                                                </div>
                                            )}
                                            {isDriverOwnerPage ? null : (
                                                <div className={cn('stats')}>
                                                    <DispatcherStats user={user} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <CompanyBriefStatistics company={company} />
                            )}
                        </>
                    )}
                </div>
            </div>
        ),
        [
            isDispatcherOrDriverPage,
            logoUrl,
            companyName,
            type,
            userAddress,
            address,
            rating,
            reviewsTotal,
            isAdditionalInfoNeeded,
            user,
            isRatingPanel,
            isDriverOwnerPage,
            company,
        ],
    );

    return (
        <Paper
            className={cn('')}
            body={body}
            footerClassName={cn('footer')}
            footer={
                hasBriefActions && (
                    <CompanyBriefActions
                        isFlagged={isFlagged}
                        id={isDispatcherOwnerPage || isDriverOwnerPage ? owner.publicId : publicId}
                        name={isDispatcherOwnerPage || isDriverOwnerPage ? owner.name : name}
                    />
                )
            }
        />
    );
};
