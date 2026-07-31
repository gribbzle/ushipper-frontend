import React from 'react';

import { CompanyLogo } from '@/components/client/company/company-logo';
import { CarriersCatalogInfo } from '@store/client';
import { classname } from '@utils/classname';

import { CatalogInfoWrapper } from '../catalog-info-wrapper';
import { CompanyNameInfoBlock } from '../company-name-block';
import { CompanyRatingBlock } from '../company-rating-block';
import { CompanyTypeAddressBlock } from '../company-type-address-block';

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
