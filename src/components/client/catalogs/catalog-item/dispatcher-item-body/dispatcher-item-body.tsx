import React from 'react';

import { DispatcherLanguages, FlagButton, InfoListBody, PillTag } from '@/components/common';
import { useShowCompanyPage } from '@hooks';
import { DispatcherCatalogInfo } from '@store/client';
import { classname, getTransportServiceTranslate, getWorkingTimeTranslate } from '@utils';

import { DispatcherPersonalInfo } from '../../common';

import { useDispatcherItemBody } from './use-dispatcher-item-body';

import './dispatcher-item-body.scss';

const cn = classname('dispatcher-item-body');

export const DispatcherItemBody = ({ dispatcher }: { dispatcher: DispatcherCatalogInfo }) => {
    const { isFlagged, communicationLanguages, specializations, businessHours, company, publicId } = dispatcher;

    const { handleUnFlaggedClick, handleFlaggedClick } = useDispatcherItemBody(publicId);
    const { handleShowCompanyPage } = useShowCompanyPage();

    return (
        <div onClick={() => handleShowCompanyPage(company.publicId)} className={cn('')}>
            <DispatcherPersonalInfo dispatcher={dispatcher} companyPublicId={dispatcher.company.publicId} />
            <div className={cn('business-hours')}>{getWorkingTimeTranslate(businessHours)}</div>
            <div className={cn('right')}>
                <div className={cn('row')}>
                    <DispatcherLanguages languages={communicationLanguages} />

                    <FlagButton isFlagged={isFlagged} handleMarkAsFlaggedClick={handleFlaggedClick} handleMarkAsUnFlaggedClick={handleUnFlaggedClick} />
                </div>

                <InfoListBody
                    items={specializations?.map(specialization => specialization.name)}
                    renderItem={item => <PillTag key={item}>{getTransportServiceTranslate(item)}</PillTag>}
                />
            </div>
        </div>
    );
};
