import * as validate from 'joi';

import { FactoringProvider, FeeCategoryTermType, FeeCategoryValueType, FeeRecurringWeekDay, RecurringIntervalType } from '@enums';

const stringValidator = validate.string();
const numberValidator = validate.number();
const booleanValidator = validate.boolean();

export const optionalStringValidator = stringValidator.optional();
export const requiredStringValidator = stringValidator.trim().required();
export const nullableStringValidator = stringValidator.allow(null);
export const nullableOptionalStringValidator = nullableStringValidator.optional();

export const optionalNumberValidator = numberValidator.optional();
export const requiredNumberValidator = numberValidator.required();
export const nullableNumberValidator = numberValidator.allow(null);
export const nullableOptionalNumberValidator = nullableNumberValidator.optional();

export const requiredBooleanValidator = booleanValidator.required();

export const enumValidator = <T extends string>(values: Record<string, T>) => validate.string<T>().valid(...Object.values(values));

export const factoringProviderValidator = enumValidator(FactoringProvider);
export const feeCategoryValueTypeValidator = enumValidator(FeeCategoryValueType);
export const feeCategoryTermTypeValidator = enumValidator(FeeCategoryTermType);
export const feeRecurringWeekDayValidator = enumValidator(FeeRecurringWeekDay);
export const recurringIntervalTypeValidator = enumValidator(RecurringIntervalType);
