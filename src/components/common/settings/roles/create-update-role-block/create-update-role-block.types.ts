import { UserRoleType } from '@/enums/user-role-type';
import { SelectOption } from '@/shared';

export type CreateUpdateRoleFormState = {
    name: string;
    roleType: UserRoleType | null;
    subordinateRoleIds?: SelectOption[];
};
