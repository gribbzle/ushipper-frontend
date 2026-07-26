import { BalanceValue } from '@store/admin';

export const getCounterValue = (value?: number | BalanceValue): string | number | undefined => {
    if (typeof value === 'number') {
        return value;
    }

    return value?.formatted;
};
