import { ExternalServiceData, FactoringEmailsData, FeeData } from '@types';

export type CarrierAccountingDrawerFormValue = {
    isPartner: boolean;
    delayedFees: FeeData[];
    instantFees: FeeData[];
    deletedDelayedFees: number[];
    deletedInstantFees: number[];
    centralDispatch?: ExternalServiceData;
    superDispatch?: ExternalServiceData & { code?: string | null };
    factoringEmails?: FactoringEmailsData;
    enablePaymentSystem: boolean;
};

export type CreateDeleteFeesArgs = {
    fees: FeeData[];
};
