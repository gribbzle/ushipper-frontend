import React from 'react';

import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { classname } from '@utils/classname';

import { JobOfferStatusTagProps } from './job-offer-status-tag.types';

import './job-offer-status-tag.scss';
import SendSimpleIcon from '@/assets/icons/send-simple-icon.svg';

const cn = classname('job-offer-status-tag');

export const JobOfferStatusTag = ({ children, view }: JobOfferStatusTagProps) => (
    <div className={cn('', { view })}>
        {view === OfferStatusesEnum.NEW && <SendSimpleIcon />}
        {children}
    </div>
);
