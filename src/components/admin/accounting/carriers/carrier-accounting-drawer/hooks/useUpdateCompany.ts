import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { usePublicId } from '@hooks';
import { usePathCompanyJSONMutation } from '@store/api/company-api';
import { handleError, translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:notifications');

export const useUpdateCompany = () => {
    const companyId = usePublicId();
    const [updateCompany] = usePathCompanyJSONMutation();

    const handleUpdateCompany = useCallback(
        async ({ isPartner, enablePaymentSystem }: { isPartner: boolean; enablePaymentSystem: boolean }) => {
            try {
                await updateCompany({
                    companyId,
                    data: { isPartner, enablePaymentSystem },
                }).unwrap();

                toast.success<string>(t('update-company-success'));
            } catch (error) {
                handleError(error);
            }
        },
        [companyId, updateCompany],
    );

    return handleUpdateCompany;
};
