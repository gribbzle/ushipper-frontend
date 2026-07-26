import { BusinessDaysPaymentMethod, CodCopPaymentMethod } from '@/enums';

export const isInstantTermPaymentMethod = (method?: string | null): boolean =>
    !!method && Object.values(CodCopPaymentMethod).includes(method as CodCopPaymentMethod);

export const isDelayedTermPaymentMethod = (method?: string | null): boolean =>
    !!method && Object.values(BusinessDaysPaymentMethod).includes(method as BusinessDaysPaymentMethod);
