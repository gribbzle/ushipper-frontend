import React, { useCallback, useState } from 'react';

import { CarrentIcon } from '@icons';
import { classname } from '@utils/classname';

import './collapsible-section.scss';

type Props = {
    title: string;
    children: React.ReactNode;
    opened?: boolean;
    className?: string;
};

const cn = classname('collapsible-section');

export const CollapsibleSection = (props: Props) => {
    const { children, title, opened = true, className } = props;
    const [isOpen, setIsOpen] = useState(opened);

    const toggleIsOpenHandler = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    return (
        <div className={cn('', { open: isOpen }, [className])}>
            <div className={cn('head')} onClick={toggleIsOpenHandler}>
                {title}
                <CarrentIcon />
            </div>
            <div className={cn('body')}>{children}</div>
        </div>
    );
};
