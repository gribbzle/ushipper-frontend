import React, { FC, MouseEvent, SVGProps, useCallback, useRef, useState } from 'react';

import { Paper } from '@/components/common';
import { TrackingOrderStatus } from '@/enums';
import { CloseIcon, Ellipse, LikeIcon, QuestionIcon } from '@icons';
import { classname, getTrackingOrderStatusTranslate, translateByNamespace } from '@utils';

import './tracking-help-paper.scss';

type LegendItemProps = {
    label: string;
    Icon: FC<SVGProps<SVGSVGElement>>;
    color: string;
};

type LegendSectionProps = {
    title: string;
    items: LegendItemProps[];
};

const t = translateByNamespace('client:tracking-page:help-paper');
const cn = classname('help-paper');

const orderMarkers = [
    { Icon: Ellipse, label: getTrackingOrderStatusTranslate(TrackingOrderStatus.NOT_DISPATCHED), color: 'secondary' },
    { Icon: Ellipse, label: getTrackingOrderStatusTranslate(TrackingOrderStatus.DISPATCHED), color: 'sapphire' },
    { Icon: Ellipse, label: getTrackingOrderStatusTranslate(TrackingOrderStatus.PICKED_UP), color: 'lemon' },
];

const truckColors = [
    { Icon: Ellipse, label: t('empty'), color: 'gray' },
    { Icon: Ellipse, label: t('partially-loaded'), color: 'golden' },
];

const otherItems = [{ Icon: LikeIcon, label: t('favorite-driver'), color: 'green' }];

const LegendItem = ({ Icon, label, color }: LegendItemProps) => (
    <div className={cn('content-details-legend')}>
        <Icon className={cn('content-icon', { color })} /> {label}
    </div>
);

const LegendSection = ({ title, items }: LegendSectionProps) => (
    <div className={cn('content-details')}>
        <h4>{title}</h4>
        {items.map(({ Icon, label, color }) => (
            <LegendItem key={label} Icon={Icon} label={label} color={color} />
        ))}
    </div>
);

export const TrackingHelpPaper = () => {
    const [hideContent, setHideContent] = useState<boolean>(true);
    const ref = useRef<HTMLInputElement>(null);

    const toggleVisibility = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            setHideContent(prevState => !prevState);
        },
        [setHideContent],
    );

    return (
        <div className={cn('')}>
            <Paper
                className={cn('content', { hide: hideContent })}
                paperRef={ref}
                body={
                    <div className={cn('content-body')}>
                        <div className={cn('content-head')}>
                            {t('title')}
                            <div className={cn('content-close')} onClick={() => setHideContent(true)}>
                                <CloseIcon />
                            </div>
                        </div>
                        <div className={cn('content-block')}>
                            <LegendSection title={t('order-marker-colors')} items={orderMarkers} />
                            <LegendSection title={t('truck-colors')} items={truckColors} />
                            <LegendSection title={t('other')} items={otherItems} />
                        </div>
                    </div>
                }
            />

            <button type='button' className={cn('icon')} onClick={e => toggleVisibility(e)}>
                <QuestionIcon />
            </button>
        </div>
    );
};
