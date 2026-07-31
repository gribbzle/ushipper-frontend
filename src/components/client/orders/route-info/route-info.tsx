import React from 'react';

import { classname } from '@utils/classname';

import './route-info.scss';

const cn = classname('route-info');

type Props = {
    firstItem: {
        text: string | null;
        subText: string | null;
    };
    secondItem: {
        text: string | null;
        subText: string | null;
    };
    firstItemTextStyle?: 'warning' | string;
    secondItemTextStyle?: 'warning' | string;
};
export default function RouteInfo({ firstItem, secondItem, firstItemTextStyle, secondItemTextStyle }: Props) {
    return (
        <div className={cn()}>
            <div className={cn('icons-block')}>
                <div className={cn('first-item-icon')} />
                <div className={cn('line')} />
                <div className={cn('second-item-icon')} />
            </div>
            <div>
                <div className={cn('item')}>
                    <div className={cn('text', { 'text-style': firstItemTextStyle })}>{firstItem.text}</div>
                    <span className={cn('dot')} />
                    <div className={cn('sub-text')}>{firstItem.subText}</div>
                </div>
                <div className={cn('item')}>
                    <div className={cn('text', { 'text-style': secondItemTextStyle })}>{secondItem.text}</div>
                    <span className={cn('dot')} />
                    <div className={cn('sub-text')}>{secondItem.subText}</div>
                </div>
            </div>
        </div>
    );
}
