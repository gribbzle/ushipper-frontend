import React from 'react';

import { PillTag } from '@/components/common';
import { Specialization } from '@store/common';
import { classname, getTransportServiceTranslate } from '@utils';

import { CatalogInfoWrapper } from '../catalog-info-wrapper';

import './carrier-specializations-block.scss';

const cn = classname('carrier-specializations');

export const CarrierSpecializationBlock = ({ specializations }: { specializations: Specialization[] }) => (
    <CatalogInfoWrapper className={cn('')}>
        {specializations.map(specialization => (
            <PillTag key={specialization.id}>{getTransportServiceTranslate(specialization.name)}</PillTag>
        ))}
    </CatalogInfoWrapper>
);
