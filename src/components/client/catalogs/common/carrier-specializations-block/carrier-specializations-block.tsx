import React from 'react';

import { PillTag } from '@/components/common/pill-tag/pill-tag';
import { Specialization } from '@store/common';
import { classname } from '@utils/classname';
import { getTransportServiceTranslate } from '@utils/specialization';

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
