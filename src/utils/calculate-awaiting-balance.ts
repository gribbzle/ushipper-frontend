import { convertCentsToDollars, convertCentsToInteger } from './converter';
import { formatToCurrency } from './numbers';

export const calculateAwaitingBalance = ({ withdrawal, deposit }: { withdrawal?: string; deposit?: string }) => {
    const depositCents = convertCentsToInteger(deposit);
    const withdrawalCents = convertCentsToInteger(withdrawal);
    const awaitingBalance = convertCentsToDollars(depositCents - withdrawalCents);

    return formatToCurrency(awaitingBalance);
};
