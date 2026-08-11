import { Schema } from 'joi';

import { ExternalServiceData, FactoringEmailsData } from '@/types/company-external-service-settings';

import { externalServiceValidationSchema, factoringEmailsValidationSchema } from '../schemas/company-external-service-settings';
import { changesInfoDetailsSchema } from '../schemas/issue';
import { ChangesInfoDetails } from '../store/api/issues-api';

import { validateFeeData } from './fee';

const validateOrUndefined = <T>(data: unknown, schema: Schema<T>): T | undefined => {
    const { error, value } = schema.validate(data);

    return error ? undefined : value;
};

export { validateFeeData };
export const validateExternalServicePayload = (data: unknown): ExternalServiceData | undefined => validateOrUndefined(data, externalServiceValidationSchema);
export const validateFactoringEmailsPayload = (data: unknown): FactoringEmailsData | undefined => validateOrUndefined(data, factoringEmailsValidationSchema);
export const validateIssueChangesInfoDetails = (data: unknown): ChangesInfoDetails | undefined => validateOrUndefined(data, changesInfoDetailsSchema);
