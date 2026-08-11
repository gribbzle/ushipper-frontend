import { NonNullableFields } from '@/shared/nullable';

export function getObjectWithoutEmptyFields<T extends Record<string, unknown>>(obj: T): NonNullableFields<T> {
    const acc: Partial<T> = {};

    for (const key in obj) {
        if (obj[key] && obj[key] !== undefined && obj[key] !== null) acc[key] = obj[key];
    }

    return acc as NonNullableFields<T>;
}

export const areObjectsShallowEqual = (obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    (Object.keys(obj1) as (keyof typeof obj1)[]).every(key => {
        return Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] === obj2[key];
    });
