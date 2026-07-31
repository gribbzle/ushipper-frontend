import React from 'react';
import { useRouter } from 'next/router';

import { getAllFiltersFromUrlParams } from '@/components/client/company/review-filters-tabs/utils';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderTextWithBreakLines } from '@utils/render';

import './reviews-no-data.scss';

const cn = classname('reviews-no-data');
const t = translateByNamespace('client:company-page');

export const ReviewsNoData = () => {
    const router = useRouter();
    const allUrlParams = getAllFiltersFromUrlParams(router.query);

    return <Paper body={<div className={cn()}>{renderTextWithBreakLines(t(`${allUrlParams.rating ? 'no-data-filter' : 'no-data-all-reviews'}`))}</div>} />;
};
