import { ExternalServiceType } from '@/enums/company/external-service-type';
import { FactoringProvider } from '@/enums/company/factoring-provider';

export type CompanyExternalServiceParams = {
    companyId: string;
    type: ExternalServiceType;
};

export type ExternalServiceData = {
    login: string;
    password: string;
};

export type ExternalServiceCredentialsRequest = CompanyExternalServiceParams & ExternalServiceData;

export type EmailServerCredentialType = 'smtp' | 'imap';

export type EmailServerCredentials = {
    host: string;
    username: string;
    password: string;
};

export type FactoringEmailsData = {
    driver: FactoringProvider;
    smtp: EmailServerCredentials;
    imap: EmailServerCredentials;
    incomingEmail: string;
    outgoingEmail: string;
    autoSendFactoringRequest: boolean;
    autoTransferFundsOnApproval: boolean;
};

export type FactoringEmailSettingsRequest = CompanyExternalServiceParams & FactoringEmailsData;

export type CompanyExternalServiceSettings = {
    company: {
        publicId: string;
        name: string;
    };
    type: ExternalServiceType;
    payload: ExternalServiceData | FactoringEmailsData;
};
