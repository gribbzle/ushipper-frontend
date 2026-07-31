import { numberWithCommas } from '@utils/numbers';

export const formatLoadboardTabCounter = (counter?: number) => {
    if (counter !== undefined) {
        return numberWithCommas(counter);
    }
};
