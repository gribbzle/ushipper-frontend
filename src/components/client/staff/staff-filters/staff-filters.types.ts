export type StaffFiltersFormState = {
    name?: string;
    phone?: string;
    email?: string;
    roleId?: number;
    status?: string;
    companyName?: string;
};

export type StaffQueryParams = Partial<Record<keyof StaffFiltersFormState, string | number> & { orderName: string; orderDirection: string; perPage?: number }>;

export type StaffTableView = 'list' | 'tree';

export type StaffFiltersFormProps = {
    isRoleFieldVisible?: boolean;
    isEmailFieldVisible?: boolean;
    isCompanyFieldVisible?: boolean;
    onViewChange?: (view: StaffTableView) => void;
};
