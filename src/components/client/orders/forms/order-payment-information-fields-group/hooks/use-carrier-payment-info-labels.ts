import { useMemo } from 'react';

import { translateByNamespace } from '@utils';

import { useGetPaymentInformationValues } from './use-get-payment-information-values';
import { useTermsFieldSelected } from './use-terms-field-selected';

const t = translateByNamespace('client:order:payment-information');

export const useCarrierPaymentInfoLabels = () => {
    const {
        isSelectedInstantTermInInstantField,
        isSelectedDelayedTermInInstantField,
        isSelectedDelayedTermInDelayedField,
        isSelectedInstantTermInDelayedField,
    } = useTermsFieldSelected();
    const { delayedTerms } = useGetPaymentInformationValues();

    const termLabelsMap = useMemo(
        () =>
            new Map([
                [isSelectedInstantTermInInstantField, t('fields.instant-terms')],
                [isSelectedDelayedTermInInstantField, t('fields.delayed-terms')],
                [!isSelectedInstantTermInInstantField && !isSelectedDelayedTermInInstantField, t('fields.term')],
                [!isSelectedInstantTermInInstantField && isSelectedDelayedTermInDelayedField, t('fields.instant-terms')],
            ]),
        [isSelectedInstantTermInInstantField, isSelectedDelayedTermInInstantField, isSelectedDelayedTermInDelayedField],
    );

    const termLabel = useMemo(() => {
        for (const [condition, label] of termLabelsMap) {
            if (condition) {
                return label;
            }
        }

        return t('fields.term');
    }, [termLabelsMap]);

    const delayedTermLabel = useMemo(() => {
        if (delayedTerms && isSelectedInstantTermInDelayedField) {
            return t('fields.instant-terms');
        }

        if (isSelectedInstantTermInInstantField || (!isSelectedInstantTermInInstantField && !isSelectedDelayedTermInInstantField && delayedTerms)) {
            return t('fields.delayed-terms');
        }

        return t('fields.instant-terms');
    }, [isSelectedInstantTermInInstantField, isSelectedDelayedTermInInstantField, isSelectedInstantTermInDelayedField, delayedTerms]);

    const addTermsLabel = useMemo(
        () =>
            isSelectedDelayedTermInInstantField || isSelectedDelayedTermInDelayedField ? t('fields.add-instant-term-btn') : t('fields.add-delayed-term-btn'),
        [, isSelectedDelayedTermInInstantField, isSelectedDelayedTermInDelayedField],
    );

    return { termLabel, delayedTermLabel, addTermsLabel };
};
