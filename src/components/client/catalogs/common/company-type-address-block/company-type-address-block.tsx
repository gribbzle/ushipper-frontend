import React from 'react';

import { Tag } from '@/components/common';
import { GeoLocationIcon } from '@icons';
import { classname, getCompanyTypeTranslate } from '@utils';

import { CompanyTypeAddressBlockProps } from './company-type-address-block.types';
import { useCompanyTypeAddressBlock } from './use-company-type-address-block';

import './company-type-address-block.scss';

const cn = classname('company-type-address');

export const CompanyTypeAddressBlock = ({ city, state, companyType }: CompanyTypeAddressBlockProps) => {
    const { address } = useCompanyTypeAddressBlock({ city, state });

    return (
        <div className={cn()}>
            <Tag type='gray' size='round'>
                {getCompanyTypeTranslate(companyType)}{' '}
            </Tag>
            {address && (
                <div className={cn('address')}>
                    <GeoLocationIcon /> {address}
                </div>
            )}
        </div>
    );
};
