import { numberWithCommas } from '@utils';

export const formatLoadboardTabCounter = (counter?: number) => {
    if (counter !== undefined) {
        return numberWithCommas(counter);
    }
};
