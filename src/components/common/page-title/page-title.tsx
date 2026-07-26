import React from 'react';

import { classname } from '@utils';

import './page-title.scss';

const cn = classname('page-title');

type Props = {
    title: string;
    className?: string;
};

export const PageTitle = ({ title, className }: Props) => <span className={cn('', [className])}>{title}</span>;
