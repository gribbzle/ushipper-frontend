import React from 'react';

import { classname } from '@utils';

import './status-block.scss';

export type StatusBlockView = 'danger' | 'warning' | 'success' | 'blocked';

type Props = {
    children: React.ReactNode;
    view?: StatusBlockView;
    isHover?: boolean;
};

const cn = classname('status-block');

export const StatusBlock = ({ children, view = 'success', isHover = false }: Props) => <div className={cn('', { view, hover: isHover })}>{children}</div>;
