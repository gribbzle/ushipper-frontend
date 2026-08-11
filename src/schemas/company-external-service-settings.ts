import Joi from 'joi';

import { ExternalServiceData, FactoringEmailsData } from '@/types/company-external-service-settings';

import { factoringProviderValidator, requiredBooleanValidator, requiredStringValidator } from '../validators/jois';

export const externalServiceValidationSchema = Joi.object<ExternalServiceData>({
    login: requiredStringValidator,
    password: requiredStringValidator,
}).unknown(true);

export const emailServerSchema = Joi.object({
    host: requiredStringValidator,
    username: requiredStringValidator,
    password: requiredStringValidator,
}).unknown(true);

export const factoringEmailsValidationSchema = Joi.object<FactoringEmailsData>({
    driver: factoringProviderValidator.required(),
    smtp: emailServerSchema.required(),
    imap: emailServerSchema.required(),
    incomingEmail: requiredStringValidator,
    outgoingEmail: requiredStringValidator,
    autoSendFactoringRequest: requiredBooleanValidator,
    autoTransferFundsOnApproval: requiredBooleanValidator,
}).unknown(true);
