import React from 'react';

import { DispatcherLanguages } from '@/components/common/dispatcher-languages/dispatcher-languages';
import { InfoListBody } from '@/components/common/info-list/info-list-body/info-list-body';
import { PillTag } from '@/components/common/pill-tag/pill-tag';
import { AuthorizedUserInfo } from '@store/global/types';
import { classname } from '@utils/classname';
import { getWorkingTimeTranslate } from '@utils/get-working-time-translate';
import { getTransportServiceTranslate } from '@utils/specialization';

import './dispatcher-details-info-column.scss';

const cn = classname('dispatcher-details-info');

export const DispatcherDetailsInfoColumn = ({ dispatcher }: { dispatcher: AuthorizedUserInfo }) => {
    const { communicationLanguages, specializations, businessHours } = dispatcher;

    return (
        <div className={cn('')}>
            <span className={cn('business-hours')}>{getWorkingTimeTranslate(businessHours)}</span>
            <InfoListBody
                items={specializations?.map(specialization => specialization.name)}
                renderItem={item => <PillTag key={item}>{getTransportServiceTranslate(item)}</PillTag>}
            />
            {communicationLanguages && <DispatcherLanguages languages={communicationLanguages} />}
        </div>
    );
};
