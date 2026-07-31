import React from 'react';

import { classname } from '@utils/classname';

import './input-label.scss';

const cn = classname('input-label');

type Props = {
    children: React.ReactNode;
    required?: boolean;
    className?: string;
};

export const InputLabel = ({ required, children, className }: Props) => (
    <label className={cn('', [className])}>
        {required && <span className={cn('', { required })}>*</span>}
        <span className={cn('text')}>{children}</span>
    </label>
);
