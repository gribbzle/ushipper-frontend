import React, { useCallback, useState } from 'react';

import { IconButton } from '@/components/common/icon-button/icon-button';
import { classname } from '@utils/classname';

import { CatalogFiltersGroupProps } from './catalog-filter-group.types';

import './catalog-filter-group.scss';
import MinusIcon from '@/assets/icons/minus-icon.svg';
import PlusIcon from '@/assets/icons/plus.svg';

const cn = classname('catalog-filter-group');

export const CatalogFiltersGroup = ({ children, title }: CatalogFiltersGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpand = useCallback(() => setIsExpanded(!isExpanded), [isExpanded]);

    return (
        <div className={cn()}>
            <div className={cn('header')}>
                <IconButton Icon={isExpanded ? MinusIcon : PlusIcon} onClick={toggleExpand} />
                {title}
            </div>
            {isExpanded && children}
        </div>
    );
};

export const CatalogFiltersSubGroup = ({ children, title }: CatalogFiltersGroupProps) => (
    <div className={cn('sub-group')}>
        <div className={cn('sup-title')}>{title}</div>
        {children}
    </div>
);
