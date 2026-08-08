import React from 'react';

import { Button } from '@/components/common/button/button';
import { Paper } from '@/components/common/paper/paper';
import { MagnifyingGlassIcon } from '@icons';
import { classname } from '@utils/classname';

import { EmptyLayoutProps } from './empty-layout.types';
import { useEmptyLayout } from './use-empty-layout';

import './empty-layout.scss';

const cn = classname('empty-layout');

export const EmptyLayout = ({ title, subTitle, pathTo, asPathTo, buttonTitle }: EmptyLayoutProps) => {
    const { isShipper, isCarrier, onClickHandler } = useEmptyLayout(pathTo, asPathTo);

    return (
        <Paper
            className={cn()}
            body={
                <div className={cn('wrapper')}>
                    <div className={cn('title')}>{title}</div>
                    {!isShipper && subTitle && <div className={cn('sub-title')}>{subTitle}</div>}
                    {isCarrier && buttonTitle && (
                        <Button view='primary' plain={true} onClick={onClickHandler} className={cn('link-btn-to-lb')}>
                            <MagnifyingGlassIcon />
                            {buttonTitle}
                        </Button>
                    )}
                </div>
            }
        />
    );
};
