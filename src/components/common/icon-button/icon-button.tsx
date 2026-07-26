import React from 'react';

import { classname } from '@utils';

import './icon-button.scss';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    size?: 'default' | 'mini' | 'medium';
    active?: boolean;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const cn = classname('icon-button');

export const IconButton = (props: Props) => {
    const { className, size = 'default', Icon, ...rest } = props;

    return (
        <button type='button' className={cn('', { size }, [className])} {...rest}>
            <Icon />
        </button>
    );
};
