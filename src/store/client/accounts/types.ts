import { AccountStatusesEnum, CompanyStatusEnum, UserRoleGroup, UserRoleType } from '@enums';
import { BalanceResource } from '@store/admin/accounting/balance-types';
import { Company } from '@store/admin/companies/types';
import { Avatar } from '@store/common/staff/avatar-types';
import { Permissions } from '@store/global/shared-types';
import { Fee } from '@types';

type AccountUserRole = {
    name: string;
    type: UserRoleType;
    group: UserRoleGroup;
    permissions?: Permissions;
    id: number;
};

type AccountSuperiorUserCompany = Pick<Company, 'publicId' | 'name' | 'isPartner' | 'type'>;

export type AccountSuperiorUser = {
    publicId: string;
    name: string;
    nickname?: string | null;
    avatar: Avatar | null;
    role: AccountUserRole;
    company?: AccountSuperiorUserCompany | null;
    createdAt: string;
    updatedAt: string;
    lastLoginedAt: string;
    status: CompanyStatusEnum;
};

export type AccountUser = {
    publicId: string;
    avatar: Avatar | null;
    status: CompanyStatusEnum;
    role: AccountUserRole;
    // Admin users have not a company
    company?: Company;
    name: string;
    email: string;
    phone: string;
    lastLoginedAt: string;
    createdAt: string;
    updatedAt: string;
    superiorUser?: AccountSuperiorUser | null;
};

export type ParentData = {
    publicId: string;
    id: number;
    type: UserRoleType.DRIVER_OWNER;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
};

export type AccountData = {
    publicId: string;
    name: string;
    users: AccountUser[];
    id?: number;
    type?: UserRoleType;
    email: string;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
    balances: BalanceResource[];
    parent: ParentData | null;
    ownerUser: AccountUser;
    phoneVerifiedAt: string | null;
    emailVerifiedAt: string | null;
    fees: Fee[];
    telegramId: string | null;
    status: AccountStatusesEnum;
    parentId: string | null;
};

export type AddressData = {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

export type AccountProfileData = {
    businessName: string;
    legalName: string;
    dateOfBirth: string;
    cityOfBirth: string;
    countryOfBirth: string;
    sex: 'MALE' | 'FEMALE' | 'NONBINARY';
    socialNumber: string;
    socialCounty: string;
    citizenshipCountry: string;
    taxId: string;
    taxIdCountry: string;
    website: string;
    legalEntityType: string;
    dateOfFormation: string;
} & {
    publicId: string;
    type: 'individual' | 'business';
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    physicalAddress: AddressData;
    mailingAddress: AddressData;
};

export type AccountsSliceState = {
    accounts: AccountData | null;
};
