import { Schema } from 'joi';

import { changesInfoDetailsSchema, externalServiceValidationSchema, factoringEmailsValidationSchema, feeDataSchema } from '@schemas';
import { ChangesInfoDetails } from '@store/api/issues-api';
import { ExternalServiceData, FactoringEmailsData, FeeData } from '@types';

const validateOrUndefined = <T>(data: unknown, schema: Schema<T>): T | undefined => {
    const { error, value } = schema.validate(data);

    return error ? undefined : value;
};

export const validateExternalServicePayload = (data: unknown): ExternalServiceData | undefined => validateOrUndefined(data, externalServiceValidationSchema);
export const validateFactoringEmailsPayload = (data: unknown): FactoringEmailsData | undefined => validateOrUndefined(data, factoringEmailsValidationSchema);
export const validateFeeData = (data: unknown): FeeData | undefined => validateOrUndefined(data, feeDataSchema);
export const validateIssueChangesInfoDetails = (data: unknown): ChangesInfoDetails | undefined => validateOrUndefined(data, changesInfoDetailsSchema);
