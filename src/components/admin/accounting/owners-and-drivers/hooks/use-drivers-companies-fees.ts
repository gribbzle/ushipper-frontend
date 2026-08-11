import { useMemo } from 'react';

import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { Fee } from '@/types/fee';

export const useDriversCompaniesFees = (users?: AccountingAccountUserData[]) => {
    return useMemo(() => {
        const filterUniqueFees = (fees: Fee[], termType: FeeCategoryTermType) => {
            const uniqueFeesMap = new Map();

            fees.filter(fee => fee.termType === termType).forEach(fee => {
                if (!uniqueFeesMap.has(fee.feeCategory.id)) {
                    uniqueFeesMap.set(fee.feeCategory.id, fee);
                }
            });

            return Array.from(uniqueFeesMap.values());
        };

        const companyFees = users?.flatMap(user => user.company?.fees ?? []) || [];

        const delayedCompaniesFees = filterUniqueFees(companyFees, FeeCategoryTermType.DELAYED);
        const instantCompaniesFees = filterUniqueFees(companyFees, FeeCategoryTermType.INSTANT);

        return { delayedCompaniesFees, instantCompaniesFees };
    }, [users]);
};
