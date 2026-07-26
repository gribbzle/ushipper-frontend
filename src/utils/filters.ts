import isEqual from 'lodash.isequal';

type FilterLike = Record<string, any> | null | undefined;

export const areFiltersEqual = <T extends FilterLike>(first: T, second: T): boolean => {
    if (first === second || (!first && !second)) {
        return true;
    }

    if (!first || !second) {
        return false;
    }

    let equal = true;

    Object.keys(first).forEach(key => {
        equal = equal && isEqual(first[key], second[key]);
    });

    Object.keys(second).forEach(key => {
        equal = equal && isEqual(first[key], second[key]);
    });

    return equal;
};
