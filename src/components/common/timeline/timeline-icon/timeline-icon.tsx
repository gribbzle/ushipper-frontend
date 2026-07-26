import React, { FC, SVGProps } from 'react';

import { classname } from '@utils';

import './timeline-icon.scss';

type TimelineIconProps = {
    className?: string;
    view?: 'default' | 'primary-green' | 'primary';
    Icon: FC<SVGProps<SVGSVGElement>>;
};

const cn = classname('timeline-icon');

export const TimelineIcon = ({ Icon, className, view = 'default' }: TimelineIconProps) => {
    return (
        <div className={cn('', { view }, [className])}>
            <Icon />
        </div>
    );
};
