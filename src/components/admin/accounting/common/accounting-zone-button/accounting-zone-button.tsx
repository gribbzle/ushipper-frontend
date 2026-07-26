import React from 'react';

import { ZoneButton } from '@/components/common';
import { classname } from '@utils';

import { AccountingZoneButtonProps } from './accounting-zone-button.types';

import './accounting-zone-button.scss';

const cn = classname('accounting-zone-button');

export const AccountingZoneButton = ({ text, disabled = false, onClick }: AccountingZoneButtonProps) => (
    <ZoneButton label={text} onClick={onClick} className={cn('')} disabled={disabled} />
);
