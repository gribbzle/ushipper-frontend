import React from 'react';

import { classname } from '@utils';

import './info-tag.scss';

type OrderTagProps = {
    children?: React.ReactNode;
    view: 'default';
};

const cn = classname('info-tag');

export const InfoTag = ({ view, children }: OrderTagProps) => {
    return <div className={cn('', { view })}>{children}</div>;
};
