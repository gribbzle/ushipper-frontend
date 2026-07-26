import React, { useMemo } from 'react';

import { Avatar } from '@/components/common';
import { CompanyType, UserRoleType } from '@/enums';
import { useIsDriversCatalogPage } from '@hooks';
import { DispatcherCatalogInfo } from '@store/client';
import { AuthorizedUserInfo } from '@store/global/types';
import { classname } from '@utils';

import { CatalogInfoWrapper, CompanyNameInfoBlock, CompanyRatingBlock, CompanyTypeAddressBlock } from '..';

import './dispatcher-personal-info.scss';

const cn = classname('dispatcher-personal-info');

export const DispatcherPersonalInfo = ({
    dispatcher,
    companyPublicId,
    roleType,
}: {
    dispatcher: DispatcherCatalogInfo | AuthorizedUserInfo;
    companyPublicId: string;
    roleType?: UserRoleType;
}) => {
    const { avatar, name, city, state, rating, reviewsTotal } = dispatcher;
    const { isDriversCatalogPage } = useIsDriversCatalogPage();

    const type = useMemo(() => {
        if (roleType && roleType.includes('_owner')) {
            return roleType.split('_owner')[0];
        }

        return isDriversCatalogPage ? CompanyType.DRIVER : CompanyType.DISPATCHER;
    }, [roleType, isDriversCatalogPage]);

    return (
        <div className={cn('')}>
            <Avatar src={avatar?.url} />
            <CatalogInfoWrapper>
                <CompanyNameInfoBlock name={name} companyPublicId={companyPublicId} />
                <CompanyRatingBlock rating={rating} reviewsTotal={reviewsTotal} />
                <CompanyTypeAddressBlock city={city} state={state} companyType={type} />
            </CatalogInfoWrapper>
        </div>
    );
};
