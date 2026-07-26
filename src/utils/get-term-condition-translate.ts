import { translateByNamespace } from '@/utils/i18n';
import { TermCondition } from '@store/client';

const termConditionTranslate = translateByNamespace('common:term-conditions');

export const getTermConditionTranslate = (term: TermCondition): string => {
    const monthCount = parseInt(term.split('_')[0], 10);

    return termConditionTranslate('months', { count: monthCount });
};
