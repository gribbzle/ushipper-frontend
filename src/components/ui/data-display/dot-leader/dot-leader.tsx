import React from 'react';

import { Link } from '@/components/common/link/link';
import { classname } from '@utils/classname';

import './dot-leader.scss';

const cn = classname('dot-leader');

type Props = {
    label: string;
    value: string | number;
    className?: string;
    isLink?: boolean;
};

export const DotLeader = ({ label, value, className, isLink = false }: Props) => (
    <div className={cn('', [className])}>
        <div className={cn('title')}>{label}</div>
        <div className={cn('divider')}></div>
        <div className={cn('value')}>
            {isLink ? (
                <Link href={value as string} target='_blank' rel='noopener noreferrer'>
                    {value}
                </Link>
            ) : (
                value
            )}
        </div>
    </div>
);
