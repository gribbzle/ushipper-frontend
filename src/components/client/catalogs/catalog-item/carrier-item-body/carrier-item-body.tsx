import React from 'react';

import { FlagButton } from '@/components/common/flag-button/flag-button';
import { useShowCompanyPage } from '@/hooks/use-show-company-page';
import { CarriersCatalogInfo } from '@store/client';
import { classname } from '@utils/classname';

import { CarrierPersonalInfo, CarrierSpecializationBlock, CompanyContactsBlock } from '../../common';

import { useCarrierItemBody } from './use-carrier-item-body';

import './carrier-item-body.scss';

const cn = classname('carrier-item-body');

export const CarrierItemBody = ({ carrier }: { carrier: CarriersCatalogInfo }) => {
    const { publicId, isFlagged, specializations } = carrier;

    const { handleUnFlaggedClick, handleFlaggedClick } = useCarrierItemBody(publicId);
    const { handleShowCompanyPage } = useShowCompanyPage();

    return (
        <div onClick={() => handleShowCompanyPage(publicId)} className={cn('')}>
            <div className={cn('content')}>
                <CarrierPersonalInfo carrier={carrier} />
                <CompanyContactsBlock carrier={carrier} />
                {specializations && <CarrierSpecializationBlock specializations={specializations} />}
            </div>

            <FlagButton isFlagged={isFlagged} handleMarkAsFlaggedClick={handleFlaggedClick} handleMarkAsUnFlaggedClick={handleUnFlaggedClick} />
        </div>
    );
};
