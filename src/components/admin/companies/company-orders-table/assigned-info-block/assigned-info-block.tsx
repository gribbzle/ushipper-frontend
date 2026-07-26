import React from 'react';

import { CompanyType } from '@/enums';
import { Load } from '@store/client';
import { classname, getCompanyTypeTranslate } from '@utils';

import './assigned-info-block.scss';

const cn = classname('assigned-info-block');

export const AssignedInfoBlock = ({ order: { dispatcher, driver } }: { order: Load }) => (
    <div className={cn('')}>
        {dispatcher && (
            <div className={cn('user')}>
                <span className={cn('name')}>{dispatcher?.name}</span> {getCompanyTypeTranslate(CompanyType.DISPATCHER)}
            </div>
        )}
        {driver && (
            <div className={cn('user')}>
                <span className={cn('name')}>{driver?.name}</span> {getCompanyTypeTranslate(CompanyType.DRIVER)}
            </div>
        )}
    </div>
);
