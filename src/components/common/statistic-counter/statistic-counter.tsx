import React, { useCallback } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { classname } from '@utils/classname';

import './statistic-counter.scss';
import QuestionCircleIcon from '@/assets/icons/question-sircle.svg';

const cn = classname('statistic-counter');

type StatisticCounterProps<T> = {
    title: string;
    tipText?: string;
    counter: string;
    color: string;
    value?: T;
    isSelected?: boolean;
    onCounterClick?: (value?: T) => void;
};

export const StatisticCounter = <T,>({ title, tipText, counter, value, color, isSelected, onCounterClick }: StatisticCounterProps<T>) => {
    const handleOnClick = useCallback(() => {
        if (onCounterClick) {
            onCounterClick(isSelected ? undefined : value);
        }
    }, [isSelected, onCounterClick, value]);

    return (
        <div className={cn('', { selected: isSelected })} onClick={handleOnClick}>
            <div className={cn('title-and-tip-container')}>
                <span>{title}</span>
                {tipText && (
                    <Tooltip>
                        <TooltipTrigger asChild={true}>
                            <div className={cn('tip-icon')}>
                                <QuestionCircleIcon />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className={cn('tip')}>{tipText}</TooltipContent>
                    </Tooltip>
                )}
            </div>
            <div className={cn('counter')}>{counter}</div>
            <div className={cn('indicator')} style={{ borderBottom: `6px solid ${color}` }}></div>
        </div>
    );
};
