import React from 'react';

import { classname } from '@utils/classname';

import './verified-icon.scss';
import TickIcon from '@/assets/icons/tick.svg';
import XCircleIcon from '@/assets/icons/x-circle-icon.svg';

const cn = classname('verified-icon');

export const VerifiedIcon = ({ checked }: { checked: boolean }) => (
    <span className={cn('')}>{checked ? <TickIcon className={cn('success')} /> : <XCircleIcon className={cn('danger')} />}</span>
);
