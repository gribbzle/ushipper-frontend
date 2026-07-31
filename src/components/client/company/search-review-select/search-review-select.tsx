import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { FieldRenderProps } from 'react-final-form';

import { ReviewsFilterEnum } from '@/enums';
import { SelectField } from '@fields';
import { useAppSelector } from '@store';
import { companyRatingsReviewCountArraySelector, companyReviewsTotalSelector } from '@store/admin';
import { Rating } from '@ui';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './search-review-select.scss';

const t = translateByNamespace('client:company-page:filters');
const cn = classname('search-review-select');

type OptionLabelProps = {
    label: string;
    value: string | number;
    isStarsRatingVisible: boolean;
    count: number;
};

const OptionLabel = ({ label, value, isStarsRatingVisible, count }: OptionLabelProps) => (
    <div className={cn('option')}>
        {isStarsRatingVisible && <Rating initialValue={Number(value)} />}
        <span className={cn('option', { label: isStarsRatingVisible })}>{t(toKebabCase(`${label}-label`), { count })}</span>
    </div>
);

export const SearchReviewSelect = (props: FieldRenderProps<string>) => {
    const ratingsReviewCountArray = useAppSelector(companyRatingsReviewCountArraySelector);
    const totalReviewsCount = useAppSelector(companyReviewsTotalSelector) || 0;

    const options = useMemo(
        () =>
            Object.entries(ReviewsFilterEnum)
                .filter(([key, value]) => isNaN(Number(key)) && value !== ReviewsFilterEnum.ZERO)
                .map(([key, value]) => {
                    const isStarsRatingVisible = value !== ReviewsFilterEnum.ALL;
                    const count = ratingsReviewCountArray?.find(item => item.rating === value)?.count || 0;

                    return {
                        label: (
                            <OptionLabel
                                key={key}
                                label={key}
                                value={value}
                                isStarsRatingVisible={isStarsRatingVisible}
                                count={isStarsRatingVisible ? count : totalReviewsCount}
                            />
                        ),
                        value,
                    };
                }),
        [ratingsReviewCountArray, totalReviewsCount],
    );

    return <SelectField isClearable={false} options={options} placeholder={t('all-placeholder', { count: totalReviewsCount })} className={cn('')} {...props} />;
};
