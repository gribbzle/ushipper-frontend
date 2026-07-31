import React, { useMemo } from 'react';

import { Divider } from '@/components/common/divider/divider';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useAppSelector } from '@store';
import { companyAvgDetailsRatingSelector } from '@store/admin';
import { Rating } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './company-avg-details-rating-paper.scss';

type DetailProps = {
    title: string;
    count: number;
};

const t = translateByNamespace('client:company-page:avg-details-rating');
const tNoDetails = translateByNamespace('client:company-page');

const cn = classname('company-avg-details-rating');

const DetailRow = ({ title, count }: DetailProps) => {
    return (
        <div className={cn('row')}>
            <span className={cn('label')}>{title}</span>
            <div className={cn('wrapper')}>
                <Rating initialValue={count} allowFraction={true} />
                <span className={cn('wrapper-count')}>{(count ?? 0).toFixed(1)}</span>
            </div>
        </div>
    );
};

export const CompanyAvgDetailsRatingPaper = () => {
    const avgDetailsRating = useAppSelector(companyAvgDetailsRatingSelector);

    const body = useMemo(
        () => (
            <div className={cn('')}>
                <div className={cn('')}>
                    {avgDetailsRating?.length ? (
                        avgDetailsRating.map((item, index) => (
                            <React.Fragment key={index}>
                                <DetailRow title={item.title} count={item.rating} />
                                <Divider lineStyle='dashed' />
                            </React.Fragment>
                        ))
                    ) : (
                        <span className={cn('label')}>{tNoDetails('empty-value')}</span>
                    )}
                </div>
            </div>
        ),
        [avgDetailsRating],
    );

    return <Paper body={body} title={t('title')} className={cn('')} />;
};
