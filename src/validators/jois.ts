import * as validate from 'joi';

import { FactoringProvider } from '@/enums/company/factoring-provider';
import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { FeeCategoryValueType } from '@/enums/fee/fee-category-value-types-enum';
import { FeeRecurringWeekDay } from '@/enums/fee/fee-recurring-week-days-enum';
import { RecurringIntervalType } from '@/enums/fee/recurring-interval-type';

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
