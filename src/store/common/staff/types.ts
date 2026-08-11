import { CompanyStatusEnum } from '@/enums/company-status-enum';
import { UserRoleGroup } from '@/enums/user-role-group';
import { UserRoleType } from '@/enums/user-role-type';

import { NullableFields } from '@/shared/nullable';
import { Fee } from '../../../types/fee';
import { RequestWithStatus } from '../../../utils/redux';
import { BalanceResource } from '../../admin/accounting/balance-types';
import { LatestLocation, TrackingDriverRatings } from '../../client/tracking/location-types';
import { AuthorizedUserInfo, Language } from '../../global/shared-types';

import { Avatar } from './avatar-types';

export type DeviceInformation = NullableFields<{
    applicationBuildVersion: string;
    applicationVersion: string;
    deviceBrand: string;
    deviceManufacturer: string;
    deviceModelName: string;
    deviceOsName: string;
    deviceOsVersion: string;
    deviceTotalMemory: string;
    deviceType: string;
    deviceYearClass: string;
}>;

export type DriverParent = {
    publicId: string;
    name: string;
    defaultBalance: BalanceResource | null;
};

export type User = {
    avatar: Avatar | null;
    id: number;
    companyName: string;
    companyPublicId: string;
    email: string;
    name: string;
    nickname?: string;
    phone: string;
    publicId: string;
    roleId: number;
    roleGroup: string;
    roleType: string;
    roleName: string;
    status: CompanyStatusEnum;
    latestLocation: LatestLocation;
    hasSubordinates: boolean;
    subordinatesDispatchersCount: number;
    subordinatesDriversCount: number;
    roleIsSubordinationAllowed: boolean;
    ordersCount: number;
    deviceInformation: DeviceInformation;
    isPartner: boolean;
    defaultBalance: BalanceResource | null;
    fees?: Fee[];
    trailerCapacity: number;
    accountPublicId: string | null;
    parent?: DriverParent | null;
    isMultiuser?: boolean;
    rating?: number | null;
    /** Detailed driver ratings and isFlagged (only available for drivers from the order resource in broker tracking) */
    ratings?: TrackingDriverRatings;
    isFlagged?: boolean;
};

export type FetchedUsers = {
    data: User[];
    lastPage: number;
};

export type StaffFilters = NullableFields<{
    name: string;
    phone: string;
    email: string;
    roleId: number;
    status: string;
    companyName: string;
    roleType: UserRoleType;
    orderName: string;
    orderDirection: string;
    page: number;
    perPage: number;
    lastPage: number;
    roleGroup: string;
    excludeRoleGroup: string;
    superiorUserPublicId: string;
    subordinationPossibleForUserId?: string;
    superiorsForRoleId: number;
    companyId?: string;
    cursor?: string;
}>;

export type UserRole = {
    id: number;
    name: string;
    group: UserRoleGroup;
    type: UserRoleType;
    countActiveUsers: number;
    isRoleAvailableInSelect: boolean;
    editable?: boolean;
};

export type CreateEditModalState = {
    isVisible: boolean;
    mode: 'create' | 'edit' | null;
    userId: string | null;
};

export type DeleteUserPopupState = {
    isVisible: boolean;
    userId: string | null;
    userName: string | null;
    isAccountContext?: boolean;
};

export type AssignDrawerState = {
    isVisible: boolean;
    roleName: string | null;
    superiorUserPublicId: string | null;
    userName: string | null;
};

export type StaffSliceState = {
    fetchUserRoles: RequestWithStatus<UserRole[]>;
    filters: StaffFilters;
    createEditUserFormSubmit: RequestWithStatus<any>;

    fetchUser: RequestWithStatus<User>;
    createEditModal: CreateEditModalState;

    deleteUserPopup: DeleteUserPopupState;
    deleteUser: RequestWithStatus<any>;
    assignDrawer: AssignDrawerState;
};

export type CreateEditUserData = {
    publicId?: string;
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    roleId: string;
    phone: string;
    isActive: 1 | 0;
    avatar: string | File;
    twilioPhone?: string;
    trailerCapacity?: string;
    telegramId?: string;
};

export type CategoryFormState = {
    id: number;
};

export type SpecializationFormState = {
    id: number;
    categories: CategoryFormState[];
};

export type UserFormState = Omit<
    Partial<AuthorizedUserInfo>,
    | 'specializations'
    | 'avatar'
    | 'companyPublicId'
    | 'unreadChatMessagesCount'
    | 'countOfUnreadNotifications'
    | 'role'
    | 'roleId'
    | 'roleGroup'
    | 'roleName'
    | 'roleType'
    | 'accountPublicId'
> &
    Partial<{
        specializations: SpecializationFormState[];
        communicationLanguages: Language[];
        avatar: string | File;
    }>;
