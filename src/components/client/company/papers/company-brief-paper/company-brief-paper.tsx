import React, { ReactNode, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { CompanyBriefActions, Paper } from '@/components';
import { CompanyBriefStatistics, CompanyLogo, CompanyTotalRatingInfo } from '@/components/client';
import { useCompanyTypeAddressBlock } from '@/components/client/catalogs/common/company-type-address-block/use-company-type-address-block';
import { Avatar, DispatcherLanguages, Tag } from '@/components/common';
import { useIsDispatcherOwnerPage, useIsDriverOwnerPage, useIsRatingPanel } from '@hooks';
import { CheckGearIcon, GeoLocationIcon } from '@icons';
import { Company } from '@store/admin';
import { useGetUserQuery } from '@store/api/users-api';
import { classname, translateByNamespace } from '@utils';

import { DispatcherStats } from '../../dispatcher-stats';

import { useHasBriefActions } from './use-has-brief-actions';

import './company-brief-paper.scss';

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
