import React from 'react';

import { DispatcherLanguages } from '@/components/common/dispatcher-languages/dispatcher-languages';
import { FlagButton } from '@/components/common/flag-button/flag-button';
import { InfoListBody } from '@/components/common/info-list/info-list-body/info-list-body';
import { PillTag } from '@/components/common/pill-tag/pill-tag';
import { useShowCompanyPage } from '@/hooks/use-show-company-page';
import { DispatcherCatalogInfo } from '@store/client';
import { classname } from '@utils/classname';
import { getWorkingTimeTranslate } from '@utils/get-working-time-translate';
import { getTransportServiceTranslate } from '@utils/specialization';

import { DispatcherPersonalInfo } from '@/components/client/catalogs/common/dispatcher-personal-info/dispatcher-personal-info';

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
