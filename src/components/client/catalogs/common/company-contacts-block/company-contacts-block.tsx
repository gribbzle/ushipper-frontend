import React from 'react';

import { ClockIcon, GeoLocationIcon, PhoneIcon } from '@icons';
import { CarriersCatalogInfo } from '@store/client';
import { classname } from '@utils';

import { CatalogInfoWrapper } from '../catalog-info-wrapper';
import { useCompanyTypeAddressBlock } from '../company-type-address-block/use-company-type-address-block';

import './company-contacts-block.scss';

const cn = classname('company-contacts');

export const CompanyContactsBlock = ({ carrier: { city, state, phone, businessHours } }: { carrier: CarriersCatalogInfo }) => {
    const { address } = useCompanyTypeAddressBlock({ city, state });

    return (
        <CatalogInfoWrapper className={cn('')}>
            {phone && (
                <div className={cn('row')}>
                    <div className={cn('row-icon')}>
                        <PhoneIcon />
                    </div>
                    <a href={`tel:${phone}`}>{phone}</a>
                </div>
            )}
            {businessHours && (
                <div className={cn('row')}>
                    <div className={cn('row-icon')}>
                        <ClockIcon />
                    </div>
                    {businessHours}
                </div>
            )}
            {address && (
                <div className={cn('row')}>
                    <div className={cn('row-icon')}>
                        <GeoLocationIcon />
                    </div>
                    {address}
                </div>
            )}
        </CatalogInfoWrapper>
    );
};
