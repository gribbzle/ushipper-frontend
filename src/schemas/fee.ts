import Joi from 'joi';

import { FeeData } from '@types';
import {
    feeCategoryTermTypeValidator,
    feeCategoryValueTypeValidator,
    feeRecurringWeekDayValidator,
    nullableOptionalNumberValidator,
    nullableOptionalStringValidator,
    optionalNumberValidator,
    recurringIntervalTypeValidator,
    requiredNumberValidator,
} from '@validators';

export const feeDataSchema = Joi.object<FeeData>({
    feeId: optionalNumberValidator,
    feeCategoryId: requiredNumberValidator,
    value: requiredNumberValidator,
    valueType: feeCategoryValueTypeValidator.required(),
    termType: feeCategoryTermTypeValidator.allow(null).required(),
    recurringMonthDay: nullableOptionalNumberValidator,
    recurringWeekDay: feeRecurringWeekDayValidator.allow(null).optional(),
    intervalType: recurringIntervalTypeValidator.allow(null).optional(),
    intervalValue: nullableOptionalNumberValidator,
    limit: nullableOptionalNumberValidator,
    chargedTotal: nullableOptionalNumberValidator,
    accountId: nullableOptionalStringValidator,
    companyId: nullableOptionalStringValidator,
}).unknown(true);
