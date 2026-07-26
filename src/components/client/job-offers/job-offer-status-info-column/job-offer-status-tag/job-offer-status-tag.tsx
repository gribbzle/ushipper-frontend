import React from 'react';

import { OfferStatusesEnum } from '@/enums';
import { SendSimpleIcon } from '@icons';
import { classname } from '@utils';

import { JobOfferStatusTagProps } from './job-offer-status-tag.types';

import './job-offer-status-tag.scss';

const cn = classname('job-offer-status-tag');

export const JobOfferStatusTag = ({ children, view }: JobOfferStatusTagProps) => (
    <div className={cn('', { view })}>
        {view === OfferStatusesEnum.NEW && <SendSimpleIcon />}
        {children}
    </div>
);
