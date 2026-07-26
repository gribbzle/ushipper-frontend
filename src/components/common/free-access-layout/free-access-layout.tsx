import React from 'react';

import logos from '@logo';
import { classname } from '@utils';

import './free-access-layout.scss';

const cn = classname('free-access-layout');

type FreeAccessLayoutConfiguration = {
    title?: string;
    actions?: React.ReactNode;
};

type Props = FreeAccessLayoutConfiguration & {
    children: React.ReactNode;
};

const { LogoBlueMediumCarrier } = logos;

const FreeAccessLayout = ({ children, title, actions }: Props) => (
    <div className={cn()}>
        <div className={cn('header')}>
            <div className={cn('wrapper')}>
                <div className={cn('header-container')}>
                    <div className={cn('logo-wrapper')}>
                        <LogoBlueMediumCarrier />
                    </div>
                    {title && <span className={cn('title')}>{title}</span>}
                    {actions && <div className={cn('actions-container')}>{actions}</div>}
                </div>
            </div>
        </div>
        <div className={cn('content')}>
            <div className={cn('wrapper')}>{children}</div>
        </div>
    </div>
);

// eslint-disable-next-line react/display-name
export const getFreeAccessLayout = (config: FreeAccessLayoutConfiguration) => (page: React.ReactNode) =>
    <FreeAccessLayout {...config}>{page}</FreeAccessLayout>;
