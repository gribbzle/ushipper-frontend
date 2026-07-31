import { useMemo } from 'react';
import { format } from 'date-fns';

import { JobOffer } from '@store/client';
import { getTermConditionTranslate } from '@utils/get-term-condition-translate';
import { getWorkingTimeTranslate } from '@utils/get-working-time-translate';
import { translateByNamespace } from '@utils/i18n';

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
