import { NullableFields } from '@/shared';
import { Address } from '@types';

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
