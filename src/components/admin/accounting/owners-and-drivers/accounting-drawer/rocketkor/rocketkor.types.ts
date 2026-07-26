import { NullableFields } from '@/shared';

export type Address = {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

export type MailingAddress = NullableFields<Address>;

export type RocketkorFormValue = {
    type: string;
    businessName: string;
    legalName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    taxId: string;
    taxIdCountry: string;
    legalEntityType: string;
    dateOfFormation: string;
    website: string;
    areAddressesSame: boolean;
    physicalAddress: Address;
    mailingAddress: MailingAddress | null;
};
