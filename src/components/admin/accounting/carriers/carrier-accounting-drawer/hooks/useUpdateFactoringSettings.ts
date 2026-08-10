import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { ExternalServiceType } from '@/enums/company/external-service-type';
import { usePublicId } from '@/hooks/usePublicId';
import { useCreateCompanyExternalServiceSettingsMutation } from '@store/api/company-external-service-settings';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

import { CarrierAccountingDrawerFormValue } from '../carrier-accounting-drawer.types';

const t = translateByNamespace('admin:accounting:notifications');

export const useUpdateFactoringSettings = () => {
    const companyId = usePublicId();

    const [createCompanyExternalServiceSettings] = useCreateCompanyExternalServiceSettingsMutation();

    return useCallback(
        async ({ factoringEmails }: Pick<CarrierAccountingDrawerFormValue, 'factoringEmails'>) => {
            if (!factoringEmails) {
                return;
            }

            try {
                await createCompanyExternalServiceSettings({
                    ...factoringEmails,
                    type: ExternalServiceType.FACTORING_EMAILS,
                    companyId,
                });

                toast.success<string>(t('update-factoring-settings-success'));
            } catch (error) {
                handleError(error);
            }
        },
        [companyId, createCompanyExternalServiceSettings],
    );
};
