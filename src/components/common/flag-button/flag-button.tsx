import React from 'react';

import { classname } from '@utils/classname';

import { Button } from '../button';

import { FlagButtonProps } from './flag-button.types';

import './flag-button.scss';
import FlagIcon from '@/assets/icons/flag.svg';

const cn = classname('flag-button');

export const FlagButton = ({ isFlagged, handleMarkAsUnFlaggedClick, handleMarkAsFlaggedClick }: FlagButtonProps) => (
    <Button
        plain={true}
        size='small'
        view={isFlagged ? 'danger' : 'default'}
        onClick={isFlagged ? handleMarkAsUnFlaggedClick : handleMarkAsFlaggedClick}
        className={cn('', { flagged: isFlagged })}
    >
        <FlagIcon />
    </Button>
);
