import React from 'react';

import { Button } from '@/components/common';
import { FlagIcon } from '@icons';
import { classname } from '@utils';

import { FlagButtonProps } from './flag-button.types';

import './flag-button.scss';

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
