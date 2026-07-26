export type CreateEditFormState = {
    name: string;
    type: string;
    email: string;
    phone: string;
    isActive: boolean;
    ownerName: string;
    ownerPassword: string;
    ownerPasswordConfirmation: string;
    twilioPhone: string;
    avatar: string | File;
};

export type BackendErrors = {
    [K in keyof CreateEditFormState]?: string;
} & {
    owner_email?: string;
};

export type FrontendErrors = {
    [K in keyof CreateEditFormState]?: string;
};
