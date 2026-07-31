import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { CarrierAccountingDrawerTab } from '@/enums';
import { useAppDispatch, useAppSelector } from '@store';
import { carrierAccountingDrawerPropsSelector } from '@store/admin';
import { companyApi } from '@store/api/company-api';
import { handleError } from '@utils/handle-error';

import { CarrierAccountingDrawerFormValue } from './carrier-accounting-drawer.types';
import {
    useCloseCarrierAccountingDrawer,
    useInitialValuesCarrierAccountingForm,
    useUpdateCarrierFees,
    useUpdateCompany,
    useUpdateFactoringSettings,
} from './hooks';

export const useCarrierAccountingDrawer = () => {
    const formRef = useRef<FormApi<CarrierAccountingDrawerFormValue>>();
    const { isDrawerOpened, title, selectedTab } = useAppSelector(carrierAccountingDrawerPropsSelector);

    const dispatch = useAppDispatch();
    const { initialValues, isError } = useInitialValuesCarrierAccountingForm();
    const handleClose = useCloseCarrierAccountingDrawer();
    const handleUpdateIsPartnerCompany = useUpdateCompany();
    const updateFactoringSettings = useUpdateFactoringSettings();
    const updateFees = useUpdateCarrierFees();

    const handleSubmit = useCallback(
        async (values: CarrierAccountingDrawerFormValue) => {
            try {
                const { isPartner, enablePaymentSystem } = values;

                await handleUpdateIsPartnerCompany({ isPartner, enablePaymentSystem });

                switch (selectedTab) {
                    case CarrierAccountingDrawerTab.FEES:
                        await updateFees(values);
                        break;
                    case CarrierAccountingDrawerTab.FACTORING:
                        await updateFactoringSettings(values);
                        break;
                    default:
                        break;
                }

                dispatch(companyApi.util.invalidateTags([{ type: 'Companies', id: 'LIST' }]));
            } catch (error) {
                handleError(error);
            }

            handleClose();
        },
        [handleClose, handleUpdateIsPartnerCompany, selectedTab, dispatch, updateFees, updateFactoringSettings],
    );

    const handleSubmitClick = useCallback(() => {
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return {
        title,
        formRef,
        initialValues,
        isDrawerOpened,
        selectedTab,
        isError,
        handleClose,
        handleSubmit,
        handleSubmitClick,
    };
};
