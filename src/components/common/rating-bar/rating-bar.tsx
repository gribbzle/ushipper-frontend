import React from 'react';

import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToOneDecimalPercentage } from '@utils/numbers';

import './rating-bar.scss';

type Props = {
    rating?: number;
    count?: number;
    percentage: number;
};

const t = translateByNamespace('common:rating-bar');
const cn = classname('rating-bar');

export const RatingBar = ({ rating, count, percentage }: Props) => {
    return (
        <div className={cn()}>
            {rating && (
                <span className={cn('label')}>
                    {rating} {t('star-label')}
                    {rating > 1 ? 's' : ''}
                </span>
            )}
            <div className={cn('outer')}>
                <div className={cn('inner', [`${rating}`])} style={{ width: `${percentage}%` }}></div>
            </div>
            {count && (
                <span className={cn('count')}>
                    {count} {percentage > 0 && ` (${formatToOneDecimalPercentage(percentage)})`}
                </span>
            )}
        </div>
    );
};
