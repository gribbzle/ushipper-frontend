import { Fee } from '@types';
import { isFeeValueTypeFixed, isFeeValueTypePercent } from '@utils';

export const summarizeFees = (fees: Fee[]) => {
    const { percentSum, fixedSum } = fees.reduce(
        (sums, { value, valueType }) => {
            if (isFeeValueTypePercent(valueType)) {
                sums.percentSum += value;
            } else if (isFeeValueTypeFixed(valueType)) {
                sums.fixedSum += value;
            }

            return sums;
        },
        { percentSum: 0, fixedSum: 0 },
    );

    const percentPart = percentSum > 0 ? `${percentSum}%` : '';
    const fixedPart = fixedSum > 0 ? `$${fixedSum}` : '';

    return [percentPart, fixedPart].filter(Boolean).join(' + ');
};
