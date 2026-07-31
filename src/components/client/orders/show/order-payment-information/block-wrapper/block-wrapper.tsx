import React, { ReactNode } from 'react';

import { classname } from '@utils/classname';

import './block-wrapper.scss';

type BlockWrapperProps = {
    body: ReactNode;
    title: ReactNode;
};

const cn = classname('block-wrapper');

export const BlockWrapper = ({ body, title }: BlockWrapperProps) => (
    <div className={cn('')}>
        <span className={cn('title')}>{title}</span>
        {body}
    </div>
);
