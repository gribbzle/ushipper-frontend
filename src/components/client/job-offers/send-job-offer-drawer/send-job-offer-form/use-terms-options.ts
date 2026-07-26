import { useMemo } from 'react';

import { TermCondition } from '@store/client';
import { getTermConditionTranslate } from '@utils';

export const useTermsOptions = () => {
    const terms: TermCondition[] = useMemo(
        () => [
            '1_month',
            '2_months',
            '3_months',
            '4_months',
            '5_months',
            '6_months',
            '7_months',
            '8_months',
            '9_months',
            '10_months',
            '11_months',
            '12_months',
        ],
        [],
    );

    return useMemo<{ value: TermCondition; label: string }[]>(() => terms.map(term => ({ value: term, label: getTermConditionTranslate(term) })), [terms]);
};
