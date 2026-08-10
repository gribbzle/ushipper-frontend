import React, { useMemo } from 'react';

import { Avatar } from '@/components/common/avatar/avatar';
import { CompanyType } from '@/enums/company-type';
import { UserRoleType } from '@/enums/user-role-type';
import { useIsDriversCatalogPage } from '@/hooks/catalogs/use-catalog-page-status';
import { DispatcherCatalogInfo } from '@store/client';
import { AuthorizedUserInfo } from '@store/global/types';
import { classname } from '@utils/classname';

import { CatalogInfoWrapper } from '../catalog-info-wrapper';
import { CompanyNameInfoBlock } from '../company-name-block';
import { CompanyRatingBlock } from '../company-rating-block';
import { CompanyTypeAddressBlock } from '../company-type-address-block';

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
