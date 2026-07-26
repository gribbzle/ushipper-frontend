import { Fee } from '@types';
import { formatToCurrency, isFeeValueTypePercent } from '@utils';

import { FormattedFee } from './admin-ushipper-pay-details.types';

export const getFormattedFees = (fees: Fee[], totalAmount: number): FormattedFee[] =>
    fees.map(fee => {
        const value = isFeeValueTypePercent(fee.valueType)
            ? `${formatToCurrency((totalAmount * fee.value) / 100)} (${fee.value}%)`
            : `${formatToCurrency(fee.value)} ($${fee.value})`;

        return {
            label: fee.feeCategory.name,
            value,
        };
    });
