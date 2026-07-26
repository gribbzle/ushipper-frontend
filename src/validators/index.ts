import { FieldValidator, FieldValue } from './types';

export * from './financial-accounts';
export * from './required';
export * from './phone';
export * from './email';
export * from './jois';
export * from './password';
export * from './name';
export * from './number';
export * from './link';
export * from './date';
export * from './card';
export * from './schema';

export const composeValidators = (...validators: Array<FieldValidator | null>) => {
    const validatorsWithoutNulls = validators.filter(validator => !!validator) as FieldValidator[];

    return (value: FieldValue) => validatorsWithoutNulls.reduce<string | null | undefined>((error, validator) => error || validator(value), null);
};
