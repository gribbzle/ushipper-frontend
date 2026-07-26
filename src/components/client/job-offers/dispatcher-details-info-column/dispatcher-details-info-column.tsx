import React from 'react';

import { DispatcherLanguages, InfoListBody, PillTag } from '@/components/common';
import { AuthorizedUserInfo } from '@store/global/types';
import { classname, getTransportServiceTranslate, getWorkingTimeTranslate } from '@utils';

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
