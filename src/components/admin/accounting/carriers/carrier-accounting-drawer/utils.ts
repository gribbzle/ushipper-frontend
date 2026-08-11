import { toCamelCase } from 'js-convert-case';

import { RequestError } from '@/shared';
import { ExternalServiceType } from '@/enums/company/external-service-type';
import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { FeeData } from '@/types/fee';

export const getExternalServiceFieldPrefix = (serviceType: ExternalServiceType) => toCamelCase(serviceType);

export const prepareCarrierFees = (fees: FeeData[], termType: FeeCategoryTermType) => fees.map(fee => ({ ...fee, value: Number(fee.value), termType }));

export const isUnexpectedError = (isError: boolean, error?: unknown): boolean => isError && (error as RequestError)?.status !== 404;
