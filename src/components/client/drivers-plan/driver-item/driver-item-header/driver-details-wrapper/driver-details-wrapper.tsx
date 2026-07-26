import React, { FC, ReactNode, SVGProps } from 'react';

import { classname } from '@utils';

import './driver-details-wrapper.scss';

type Props = {
    title: string;
    value: ReactNode;
    Icon: FC<SVGProps<SVGSVGElement>>;
};

const cn = classname('driver-details-wrapper');

export const DriverDetailsWrapper = ({ title, value, Icon }: Props) => (
    <div className={cn()}>
        <div className={cn('icon')}>
            <Icon />
        </div>
        <div className={cn('block')}>
            <span className={cn('title')}>{title}</span>
            <span className={cn('value')}>{value}</span>
        </div>
    </div>
);
