import { useGetAccountingProfileDocumentsQuery } from '@store/api/accounts-api';

import { useGetAccountingProfile } from './use-get-accounting-profile';

export const useGetAccountingProfileDocuments = () => {
    const { account, accountingProfile } = useGetAccountingProfile();

    const { data: documents } = useGetAccountingProfileDocumentsQuery(
        { accountId: account?.publicId || '', accountingProfileId: accountingProfile?.publicId || '' },
        { skip: !account?.publicId || !accountingProfile?.publicId },
    );

    return documents;
};
