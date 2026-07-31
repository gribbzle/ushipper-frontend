import React from 'react';

import { TickIcon, XCircleIcon } from '@icons';
import { classname } from '@utils/classname';

import './verified-icon.scss';

const cn = classname('verified-icon');

export const VerifiedIcon = ({ checked }: { checked: boolean }) => (
    <span className={cn('')}>{checked ? <TickIcon className={cn('success')} /> : <XCircleIcon className={cn('danger')} />}</span>
);
