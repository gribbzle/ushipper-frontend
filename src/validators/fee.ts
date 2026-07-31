import { Schema } from 'joi';

import { FeeData } from '@types';

import { feeDataSchema } from '../schemas/fee';

const validateOrUndefined = <T>(data: unknown, schema: Schema<T>): T | undefined => {
    const { error, value } = schema.validate(data);

    return error ? undefined : value;
};

export const validateFeeData = (data: unknown): FeeData | undefined => validateOrUndefined(data, feeDataSchema);
