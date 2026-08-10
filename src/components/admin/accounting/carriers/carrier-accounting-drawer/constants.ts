import { FactoringProvider } from '@/enums/company/factoring-provider';
import { EmailServerCredentialType } from '@types';

export const DEFAULT_FACTORING_EMAILS_SETTINGS = {
    driver: FactoringProvider.FACTORING_EXPRESS,
    autoSendFactoringRequest: false,
    autoTransferFundsOnApproval: false,
    smtp: {
        host: '',
        username: '',
        password: '',
    },
    imap: {
        host: '',
        username: '',
        password: '',
    },
    incomingEmail: '',
    outgoingEmail: '',
};

export const EMAIL_SERVER_TYPES: EmailServerCredentialType[] = ['smtp', 'imap'];
