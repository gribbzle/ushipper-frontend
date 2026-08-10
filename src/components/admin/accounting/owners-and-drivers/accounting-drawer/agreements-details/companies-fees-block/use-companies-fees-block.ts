import { useMemo } from 'react';

import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { Fee } from '@types';
import { formatFeeValueType } from '@utils/fees';

export const useCompaniesFeesBlock = (fees: Fee[]) => {
    const { delayedFees, instantFees } = useMemo(() => {
        const mapFees = (fees: Fee[], termType: FeeCategoryTermType) =>
            fees
                .filter(fee => fee.termType === termType)
                .map(({ value, feeCategory: { name, valueType } }) => ({
                    label: name,
                    value: `${value}${formatFeeValueType(valueType)}`,
                }));

        const delayedFees = mapFees(fees, FeeCategoryTermType.DELAYED);
        const instantFees = mapFees(fees, FeeCategoryTermType.INSTANT);

        return { delayedFees, instantFees };
    }, [fees]);

    return { delayedFees, instantFees };
};
