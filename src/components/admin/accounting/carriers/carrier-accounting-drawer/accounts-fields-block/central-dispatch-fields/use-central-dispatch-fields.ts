import { useCallback } from 'react';
import { useFormState } from 'react-final-form';
import { toast } from 'react-toastify';

import { ExternalServiceType } from '@enums';
import { useAppDispatch, useAppSelector } from '@store';
import { carrierAccountingDrawerPropsSelector } from '@store/admin';
import { companyApi } from '@store/api/company-api';
import { useCreateCompanyExternalServiceSettingsMutation } from '@store/api/company-external-service-settings';
import { handleError, translateExternalSettingsSuccess } from '@utils';

import { CarrierAccountingDrawerFormValue } from '../../carrier-accounting-drawer.types';
import { useUpdateCompany } from '../../hooks';

export const useCentralDispatchFields = () => {
    const { companyId } = useAppSelector(carrierAccountingDrawerPropsSelector);
    const handleUpdateCompany = useUpdateCompany();
    const [createCompanyExternalServiceSettings] = useCreateCompanyExternalServiceSettingsMutation();
    const dispatch = useAppDispatch();

    const {
        values: { centralDispatch, isPartner, enablePaymentSystem },
    } = useFormState<CarrierAccountingDrawerFormValue>();

    const handleCentralDispatchSubmitClick = useCallback(async () => {
        if (!companyId || !centralDispatch) {
            return;
        }

        try {
            await handleUpdateCompany({ isPartner, enablePaymentSystem });

            await createCompanyExternalServiceSettings({
                ...centralDispatch,
                type: ExternalServiceType.CENTRAL_DISPATCH,
                companyId,
            }).unwrap();

            toast.success(translateExternalSettingsSuccess());

            dispatch(companyApi.util.invalidateTags([{ type: 'Companies', id: 'LIST' }]));
        } catch (error) {
            handleError(error);
        }
    }, [centralDispatch, companyId, createCompanyExternalServiceSettings, dispatch, enablePaymentSystem, handleUpdateCompany, isPartner]);

    return {
        handleCentralDispatchSubmitClick,
    };
};
