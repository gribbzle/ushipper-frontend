import { CompanyType, GrantTypeEnum, RegistrationType, UserRoleType } from '@/enums';
import { Company } from '@store/admin/companies/types';
import { RequestStatus, RequestWithStatus } from '@utils/redux';

export type SignUpSliceState = {
    signUpFormSubmit: RequestWithStatus;
    signUpConfirmation: {
        status: RequestStatus;
        code: number | null;
    };
    requestUSDOTVerifyFormSubmit: RequestWithStatus;
    fetchSignUpConfig: RequestWithStatus<SignUpConfig>;
};

export type SignUpFormBaseData = {
    companyType: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    userAgreesWithTerms: boolean;
    usdotNumber: string | null;
};

export type SpecializationFormData = {
    id: number;
    categories: { id: number }[];
};
export type SignUpFormData = SignUpFormBaseData & {
    specializations: SpecializationFormData[];
};

export type SignUpFormState = SignUpFormBaseData & {
    specializations: number[];
    [key: string]: any;
};
export type SignUpConfig = {
    isUsdotRegistrationRequired: boolean;
    confirmationMethod: RegistrationType;
    confirmationMethods: Record<CompanyType, RegistrationType>;
};

export type InvitationAction = {
    action: 'register' | 'login_user_code';
    company: Company;
    payload: {
        code: string;
        grantType: GrantTypeEnum;
        email: string;
        invitationCode: string;
        name: string;
        roleType: UserRoleType;
    };
};
