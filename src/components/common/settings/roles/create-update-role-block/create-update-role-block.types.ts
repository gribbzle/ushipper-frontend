import { UserRoleType } from '@/enums';
import { SelectOption } from '@/shared';

export type CreateUpdateRoleFormState = {
    name: string;
    roleType: UserRoleType | null;
    subordinateRoleIds?: SelectOption[];
};
