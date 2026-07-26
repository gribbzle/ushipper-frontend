import React from 'react';

import { DoneIcon, ErrorIcon } from '@icons';
import { classname } from '@utils';

import './status-indicator.scss';

type Props = {
    label: string;
    checked: boolean;
};

const cn = classname('status-indicator');

const StatusIndicator = ({ label, checked }: Props) => (
    <div className={cn('')}>
        <span className={cn('icon')}>{checked ? <DoneIcon className={cn('icon-done')} /> : <ErrorIcon className={cn('icon-error')} />}</span>
        <span className={cn('label', { error: !checked })}>{label}</span>
    </div>
);

export default StatusIndicator;
