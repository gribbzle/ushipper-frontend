export type DocumentFormValue = {
    name: string;
    number?: string;
    issuingDate?: string;
    expiryDate?: string;
    country?: string;
    state?: string;
    description: string;
    files: File[];
};
