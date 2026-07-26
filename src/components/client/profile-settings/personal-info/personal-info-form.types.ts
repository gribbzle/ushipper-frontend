import { AuthorizedUserInfo } from '@store/global/types';

export type PersonalInfoFormType = Partial<
    Pick<AuthorizedUserInfo, 'name' | 'phone' | 'email' | 'description' | 'address' | 'city' | 'country' | 'state' | 'zip'> & {
        avatar: string | File;
    }
>;
