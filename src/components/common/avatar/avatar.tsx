import React from 'react';

import { classname } from '@utils/classname';

import './avatar.scss';
import NoPhotoIcon from '@/assets/icons/no-photo-icon.svg';
import NoPhotoIconBlue from '@/assets/icons/no-photo-icon-blue.svg';

const cn = classname('avatar');

type Props = {
    src?: string;
    className?: string;
    size?: 'mini' | 'default' | 'huge' | 'medium';
    children?: string;
    useBlueDefaultIcon?: boolean;
};

export const Avatar = ({ src, className, size = 'default', useBlueDefaultIcon = false, children }: Props) => {
    const DefaultIcon = useBlueDefaultIcon ? NoPhotoIconBlue : NoPhotoIcon;

    return (
        <div className={cn('', { size }, [className])}>
            {children ? <span className={cn('initials')}>{children}</span> : src ? <img src={src} alt='avatar' /> : <DefaultIcon />}
        </div>
    );
};
