import React from 'react';

import { CompanyLogo } from '@/components/client/company';
import { CarriersCatalogInfo } from '@store/client';
import { classname } from '@utils';

import { CatalogInfoWrapper, CompanyNameInfoBlock, CompanyRatingBlock, CompanyTypeAddressBlock } from '..';

import './carrier-personal-info.scss';

const cn = classname('carrier-personal-info');

export const CarrierPersonalInfo = ({ carrier: { logo, name, rating, reviewsTotal, type, publicId } }: { carrier: CarriersCatalogInfo }) => (
    <div className={cn('')}>
        {logo?.url && <CompanyLogo logoUrl={logo.url} className={cn('logo')} />}
        <CatalogInfoWrapper>
            <CompanyNameInfoBlock name={name} companyPublicId={publicId} />
            <CompanyRatingBlock rating={rating} reviewsTotal={reviewsTotal} />
            <CompanyTypeAddressBlock companyType={type} />
        </CatalogInfoWrapper>
    </div>
);
