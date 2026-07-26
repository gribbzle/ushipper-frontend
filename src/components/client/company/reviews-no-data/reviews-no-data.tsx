import React from 'react';
import { useRouter } from 'next/router';

import { getAllFiltersFromUrlParams, Paper } from '@components';
import { classname, renderTextWithBreakLines, translateByNamespace } from '@utils';

import './reviews-no-data.scss';

const cn = classname('reviews-no-data');
const t = translateByNamespace('client:company-page');

export const ReviewsNoData = () => {
    const router = useRouter();
    const allUrlParams = getAllFiltersFromUrlParams(router.query);

    return <Paper body={<div className={cn()}>{renderTextWithBreakLines(t(`${allUrlParams.rating ? 'no-data-filter' : 'no-data-all-reviews'}`))}</div>} />;
};
