import { CompanyType } from '@/enums/company-type';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { CompanyTotalRating } from '@store/api/company-rating-types';
import { Specialization } from '@store/common/specialization/types';
import { Avatar } from '@store/common/staff/avatar-types';
import { Fee } from '@/types/fee';
import { PaginatedResponse, RequestWithStatus } from '@utils/redux';

type CompanyLogo = {
    publicId: string;
    url: string;
    size: number;
};

export type Company = {
    publicId: string;
    usdotNumber: number | null;
    name: string;
    nickname?: string;
    type: CompanyType;
    email: string;
    phone: string;
    status: string;
    country: string;
    address: string;
    city: string | null;
    state: string | null;
    zip: string;
    description?: string;
    website?: string;
    usersCount: number;
    ordersCount: number;
    totalGross: number;
    mcNumber?: number | null;
    birthYear?: number;
    drivers?: number;
    trailers?: number;
    rating: number | null;
    reviewsTotal: number;
    createdAt: string;
    updatedAt: string | null;
    isPartner: boolean;
    contact?: {
        names: string;
        phones: string;
        emails: string;
    } | null;
    owner: {
        name: string;
        avatar: Avatar | null;
        roleName: string;
        publicId: string;
    };
    logo: CompanyLogo | null;
    specializations: Specialization[];
    businessHours: string | null;
    activeUsersCount: number;
    isFlagged: boolean;
    fees: Fee[];
    enablePaymentSystem: boolean;
};

export type FetchedCompanies = PaginatedResponse<Company[]>;

export type CompaniesFilters = {
    searchSubjects?: string[];
    searchQuery?: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    type: string | null;
    status: string | null;
    page: number;
    perPage: number;
    lastPage: number | null;
    orderDirection: OrderSortingDirection | null;
    orderName: string | null;
};

export type CreateEditCompanyDrawerState = {
    isVisible: boolean;
    mode: 'create' | 'edit' | null;
    companyId: string | null;
};

export type DeleteCompanyPopupState = {
    isVisible: boolean;
    companyId: string | null;
    companyName: string | null;
};

export type EditCompanyData = {
    name: string;
    email: string;
    phone: string;
    isActive: 1 | 0;
    twilioPhone?: string;
};

export type CreateCompanyData = EditCompanyData & {
    type: string;
    publicId?: string;
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    ownerPassowrd?: string;
    twilioPhone?: string;
    ownerAvatar?: string | File;
};

export type CompaniesSliceState = {
    fetchCompanies: RequestWithStatus<FetchedCompanies>;
    filters: CompaniesFilters;

    createEditCompanyFormSubmit: RequestWithStatus<any>;

    fetchCompany: RequestWithStatus<Company>;
    createEditCompanyDrawer: CreateEditCompanyDrawerState;
    companyTotalRating: CompanyTotalRating | null;

    deleteCompanyPopup: DeleteCompanyPopupState;
    deleteCompany: RequestWithStatus<any>;
};
