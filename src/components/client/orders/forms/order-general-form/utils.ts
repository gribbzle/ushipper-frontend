import cleanDeep from 'clean-deep';
import { isObject, set, unset } from 'lodash';
import get from 'lodash.get';
import isEqual from 'lodash.isequal';

import { ExpenseTypeEnum, VehicleType } from '@enums';
import { OrderExpense } from '@store/api/order-expenses-api';
import { OrderCommodity, OrderVehicle } from '@store/api/orders-api';
import { hasNonUnitCommodityFields } from '@utils/commodity';

export const prepareCommodities = (commodities?: Array<Partial<OrderCommodity>>): Array<Partial<OrderCommodity>> => {
    if (!commodities) return [];

    const cleaned = commodities.map(el => cleanDeep(el)).filter(el => hasNonUnitCommodityFields(el));

    return cleaned;
};

export const prepareVehicles = (vehicles?: Array<Partial<OrderVehicle>>): Array<Partial<OrderVehicle>> => {
    if (!vehicles) return [];

    let cleaned = vehicles.map(el => cleanDeep(el));

    cleaned = cleaned.filter(el => {
        return !(Object.keys(el).length === 1 && el.type === VehicleType.OTHER);
    });

    return cleaned;
};

export const prepareExpenses = (items?: Array<Partial<OrderExpense>>): Array<Partial<OrderExpense>> => {
    if (!items) return [];

    let cleaned = items.map(el => cleanDeep(el));

    cleaned = cleaned.filter(el => {
        return !(Object.keys(el).length === 1 && el.type === ExpenseTypeEnum.OTHER);
    });

    return cleaned;
};

export function getDifferences<T extends object>(values: T, initialValues: T): Partial<T> {
    const changes = (obj: Record<string, any>, baseObj: Record<string, any>): Partial<T> => {
        if (obj === null || obj === undefined || baseObj === null || baseObj === undefined) {
            return {} as Partial<T>;
        }

        const allKeys = new Set([...Object.keys(obj), ...Object.keys(baseObj)]);

        return Array.from(allKeys).reduce((result: Partial<T>, key: string) => {
            const objValue = get(obj, key);
            const baseValue = get(baseObj, key);

            if (isObject(objValue) && objValue !== null) {
                const nestedDiff = changes(objValue, baseValue);

                // If nested changes are found, add them to the result
                if (Object.keys(nestedDiff).length > 0) {
                    set(result, key, nestedDiff);
                }
            }
            // General processing for other types (strings, numbers, etc.)
            else {
                // Changed or added field
                if (!isEqual(objValue, baseValue)) {
                    set(result, key, objValue);
                }

                // Removed field
                if (baseValue !== undefined && objValue === undefined) {
                    unset(result, key);
                }
            }

            return result;
        }, {} as Partial<T>);
    };

    return changes(values, initialValues);
}
