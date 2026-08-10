import React from 'react';

import { classname } from '@utils/classname';

import './status-indicator.scss';
import DoneIcon from '@/assets/icons/done-icon.svg';
import ErrorIcon from '@/assets/icons/error-icon.svg';

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
