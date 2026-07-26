import React, { memo, useCallback, useMemo, useRef } from 'react';
import cleanDeep from 'clean-deep';
import { Field, Form } from 'react-final-form';

import { ReviewsFilterEnum, ReviewTabsEnum } from '@/enums';
import { Paper, ReviewFiltersTabs, SearchReviewSelect, TabItemBase } from '@components';
import { classname, FormValuesSpy } from '@utils';

import './company-review-filters.scss';

export type ReviewFiltersFormState = Partial<{
    rating: string | number;
}>;

export type TabFilters = {
    tabStatus: string;
};

type CompanyReviewFiltersProps = {
    initialFilters: ReviewFiltersFormState;
    initialTabFilter?: string;
    reviewCounter?: number;
    onFiltersChange: (values: ReviewFiltersFormState) => void;
    onTabFilterClick: (value: ReviewTabsEnum) => void;
};

const cn = classname('company-review-filters');

export const CompanyReviewFilters = memo(
    ({ initialFilters, initialTabFilter, reviewCounter, onFiltersChange, onTabFilterClick }: CompanyReviewFiltersProps) => {
        const isFirstRenderRef = useRef(true);
        const handleFormSubmit = useCallback(() => undefined, []);

        const handleFiltersChange = useCallback(
            (values: ReviewFiltersFormState) => {
                if (isFirstRenderRef.current) {
                    isFirstRenderRef.current = false;

                    return;
                }

                onFiltersChange(cleanDeep({ ...values }));
            },
            [onFiltersChange],
        );

        const handleTabFilterClick = useCallback(
            (tab: TabItemBase) => {
                onTabFilterClick(tab.value as ReviewTabsEnum);
            },
            [onTabFilterClick],
        );

        const initialFormValue = useMemo<ReviewFiltersFormState>(() => {
            return {
                rating: initialFilters.rating || ReviewsFilterEnum.ALL,
            };
        }, [initialFilters]);

        const showReviewFilterForm = useMemo(() => initialTabFilter === ReviewTabsEnum.RATINGS, [initialTabFilter]);

        return (
            <Paper
                className={cn()}
                body={
                    <>
                        <ReviewFiltersTabs onTabClick={handleTabFilterClick} initialFilterTabValue={initialTabFilter} reviewCounter={reviewCounter} />
                        {showReviewFilterForm && (
                            <Form<ReviewFiltersFormState>
                                onSubmit={handleFormSubmit}
                                subscription={{
                                    values: true,
                                }}
                                initialValues={initialFormValue}
                                render={({ handleSubmit }) => (
                                    <form className={cn('form')} onSubmit={handleSubmit}>
                                        <FormValuesSpy onChange={handleFiltersChange} />
                                        <Field name='rating' component={SearchReviewSelect} />
                                    </form>
                                )}
                            />
                        )}
                    </>
                }
            />
        );
    },
);

CompanyReviewFilters.displayName = 'CompanyReviewFilters';
