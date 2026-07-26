export type CreateEditStaffDrawerProps = {
    pageId: 'administrators' | 'users' | 'staff';
    isOpen: boolean;
    onClose: () => void;
};

export type CreateEditFormState = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    role: string;
    phone: string;
    isActive: boolean;
    avatar: string | File;
    companyName: string;
    twilioPhone: string;
    telegramId: string;
    trailerCapacity: string;
};
