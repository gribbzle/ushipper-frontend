import { Avatar } from '@/store/common/staff/avatar-types';
import { CompanyStatusEnum } from '@enums';
import { Company } from '@store/admin/companies/types';

import { Rating } from '../review/rating-types';

export type UserCompanyOwner = {
    name: string;
    avatar: Avatar | null;
    role: string;
};

//TODO remove and use Company
export type UserCompany = {
    id: number;
    publicId: string;
    name: string;
    email: string;
    phone: string;
    type: 'carrier' | 'shipper';
    owner: UserCompanyOwner;
    status: CompanyStatusEnum;
    createdAt: string;
    updatedAt: string;
    rating: Rating | null;
    reviewsTotal: number;
    address: string;
    state: string;
    city: string;
} & Pick<Company, 'contact' | 'isPartner'>;
