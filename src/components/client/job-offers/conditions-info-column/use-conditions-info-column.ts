import { useMemo } from 'react';
import { format } from 'date-fns';

import { JobOffer } from '@store/client';
import { getTermConditionTranslate, getWorkingTimeTranslate, translateByNamespace } from '@utils';

const t = translateByNamespace('client:job-offers-page.job-offer.conditions');

export const useConditionsInfoColumn = (jobOffer: JobOffer) => {
    const { businessHours, dispatchFee, term, startDate } = jobOffer;

    const firstLineDetails = useMemo(
        () => [
            { label: t('time-label'), value: getWorkingTimeTranslate(businessHours) },
            { label: t('dispatch-fee-label'), value: dispatchFee ? `${dispatchFee}%` : null },
        ],
        [businessHours, dispatchFee],
    );

    const secondLineDetails = useMemo(
        () => [
            { label: t('term-label'), value: getTermConditionTranslate(term) },
            { label: t('start-date-label'), value: format(new Date(startDate), 'MMM, dd') },
        ],
        [startDate, term],
    );

    return { firstLineDetails, secondLineDetails };
};
