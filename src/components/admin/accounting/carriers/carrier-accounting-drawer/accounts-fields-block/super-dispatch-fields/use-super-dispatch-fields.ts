import { useCallback, useState } from 'react';
import { useFormState } from 'react-final-form';
import { toast } from 'react-toastify';

import { ExternalServiceType } from '@enums';
import { useAppDispatch, useAppSelector } from '@store';
import { carrierAccountingDrawerPropsSelector } from '@store/admin';
import { companyApi } from '@store/api/company-api';
import {
    useCreateCompanyExternalServiceSettingsConfirmLoginMutation,
    useCreateCompanyExternalServiceSettingsLoginMutation,
} from '@store/api/company-external-service-settings';
import { handleError, translateExternalSettingsSuccess } from '@utils';

import { CarrierAccountingDrawerFormValue } from '../../carrier-accounting-drawer.types';
import { useCloseCarrierAccountingDrawer, useUpdateCompany } from '../../hooks';

export const useSuperDispatchFields = () => {
    const { companyId } = useAppSelector(carrierAccountingDrawerPropsSelector);
    const handleCloseDrawer = useCloseCarrierAccountingDrawer();
    const handleUpdateCompany = useUpdateCompany();
    const dispatch = useAppDispatch();

    const [externalServiceLogin] = useCreateCompanyExternalServiceSettingsLoginMutation();
    const [externalServiceConfirmLogin] = useCreateCompanyExternalServiceSettingsConfirmLoginMutation();

    const {
        values: { superDispatch, isPartner, enablePaymentSystem },
    } = useFormState<CarrierAccountingDrawerFormValue>();

    const [hasVerificationCodeField, setHasVerificationCodeField] = useState<boolean>(false);

    const email = superDispatch?.login ?? '';

    const handleSuperDispatchLoginClick = useCallback(async () => {
        if (!companyId || !superDispatch) {
            return;
        }

        try {
            await handleUpdateCompany({ isPartner, enablePaymentSystem });

            await externalServiceLogin({
                ...superDispatch,
                type: ExternalServiceType.SUPER_DISPATCH,
                companyId,
            })
                .unwrap()
                .then(() => setHasVerificationCodeField(true));
        } catch (error) {
            handleError(error);
        }
    }, [companyId, superDispatch, handleUpdateCompany, isPartner, enablePaymentSystem, externalServiceLogin]);

    const handleSuperDispatchSettingsClick = useCallback(async () => {
        if (!companyId || !superDispatch) {
            return;
        }

        try {
            await externalServiceConfirmLogin({
                ...superDispatch,
                type: ExternalServiceType.SUPER_DISPATCH,
                companyId,
            }).unwrap();

            handleCloseDrawer();
            dispatch(companyApi.util.invalidateTags([{ type: 'Companies', id: 'LIST' }]));
            toast.success(translateExternalSettingsSuccess());
        } catch (error) {
            handleError(error);
        }
    }, [companyId, superDispatch, externalServiceConfirmLogin, handleCloseDrawer, dispatch]);

    return {
        handleSuperDispatchLoginClick,
        handleSuperDispatchSettingsClick,
        hasVerificationCodeField,
        email,
    };
};
