import React from 'react';

import { classname } from '@utils/classname';

import './loader.scss';

type Props = {
    className?: string;
};

const cn = classname('dots');

export const Loader = ({ className }: Props) => (
    <span className={cn('', [className])}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
    </span>
);
