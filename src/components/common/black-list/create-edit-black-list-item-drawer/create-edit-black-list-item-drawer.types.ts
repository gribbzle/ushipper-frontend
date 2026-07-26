import { CreateEditBlackListItemData } from '@store/client';

export type CreateEditBlackListItemDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export type Option = {
    label: string;
    value: string;
};

export type CreateEditFormState = Omit<CreateEditBlackListItemData, 'terms' | 'roleTypes'> & {
    isTermsVisible: boolean;
    isRoleTypesVisible: boolean;
    terms: Array<Option>;
    roleTypes: Array<Option>;
};
