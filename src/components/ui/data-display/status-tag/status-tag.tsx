import React from 'react';

import { ArrowDownIcon } from '@icons';
import { classname } from '@utils';

import './status-tag.scss';

export type StatusTagView = 'new' | 'pending' | 'success' | 'danger';

type StatusTagProps = {
    label: string;
    view: StatusTagView;
    disabled?: boolean;
};

const cn = classname('status-tag');

export const StatusTag = ({ label, view, disabled = false }: StatusTagProps) => (
    <div
        className={cn('', {
            view,
            disabled,
        })}
    >
        {label}
        {!disabled && <ArrowDownIcon className={cn('dropdown-icon')} />}
    </div>
);
