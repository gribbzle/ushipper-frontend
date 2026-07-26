import { useMemo } from 'react';

import { ExternalServiceType, FeeCategoryTermType } from '@/enums';
import { usePublicId } from '@hooks';
import { useAppSelector } from '@store';
import { carrierAccountingDrawerPropsSelector } from '@store/admin';
import { useGetCompanyExternalServiceSettingsQuery } from '@store/api/company-external-service-settings';
import { useGetFeesQuery } from '@store/api/fee-api';
import { ExternalServiceData, FactoringEmailsData } from '@types';
import { formatFeeForForm } from '@utils';
import { validateExternalServicePayload, validateFactoringEmailsPayload } from '@validators';

import { CarrierAccountingDrawerFormValue } from '../carrier-accounting-drawer.types';
import { DEFAULT_FACTORING_EMAILS_SETTINGS } from '../constants';
import { isUnexpectedError } from '../utils';

export const useInitialValuesCarrierAccountingForm = () => {
    const { isPartner, enablePaymentSystem } = useAppSelector(carrierAccountingDrawerPropsSelector);
    const companyId = usePublicId();

    const { data: companyFees = [], isError: isCompanyError } = useGetFeesQuery({ companyId });

    const {
        data: centralDispatchSettings,
        isError: isCentralDispatchError,
        error: centralDispatchError,
    } = useGetCompanyExternalServiceSettingsQuery({ companyId, type: ExternalServiceType.CENTRAL_DISPATCH });

    const {
        data: superDispatchSettings,
        isError: isSuperDispatchError,
        error: superDispatchError,
    } = useGetCompanyExternalServiceSettingsQuery({ companyId, type: ExternalServiceType.SUPER_DISPATCH });

    const {
        data: factoringEmailsSettings,
        isError: isFactoringError,
        error: factoringError,
    } = useGetCompanyExternalServiceSettingsQuery({ companyId, type: ExternalServiceType.FACTORING_EMAILS });

    const hasCentralDispatchError = useMemo(
        (): boolean => isUnexpectedError(isCentralDispatchError, centralDispatchError),
        [centralDispatchError, isCentralDispatchError],
    );

    const hasSuperDispatchError = useMemo(
        (): boolean => isUnexpectedError(isSuperDispatchError, superDispatchError),
        [isSuperDispatchError, superDispatchError],
    );

    const isFactoringEmailsError = useMemo((): boolean => isUnexpectedError(isFactoringError, factoringError), [factoringError, isFactoringError]);

    const isError = useMemo(
        (): boolean => isCompanyError || hasCentralDispatchError || hasSuperDispatchError || isFactoringEmailsError,
        [isCompanyError, hasCentralDispatchError, hasSuperDispatchError, isFactoringEmailsError],
    );

    const superDispatchSettingsPayload = useMemo((): ExternalServiceData | undefined => {
        if (hasSuperDispatchError) {
            return;
        }

        return validateExternalServicePayload(superDispatchSettings?.payload);
    }, [hasSuperDispatchError, superDispatchSettings?.payload]);

    const centralDispatchPayload = useMemo((): ExternalServiceData | undefined => {
        if (hasCentralDispatchError) {
            return;
        }

        return validateExternalServicePayload(centralDispatchSettings?.payload);
    }, [centralDispatchSettings?.payload, hasCentralDispatchError]);

    const factoringEmailsPayload = useMemo((): FactoringEmailsData | undefined => {
        if (isFactoringEmailsError) {
            return;
        }

        return validateFactoringEmailsPayload(factoringEmailsSettings?.payload);
    }, [factoringEmailsSettings?.payload, isFactoringEmailsError]);

    const initialValues = useMemo((): CarrierAccountingDrawerFormValue | undefined => {
        if (isError) {
            return;
        }

        const delayedFees = companyFees.filter(fee => fee.termType === FeeCategoryTermType.DELAYED).map(formatFeeForForm);
        const instantFees = companyFees.filter(fee => fee.termType === FeeCategoryTermType.INSTANT).map(formatFeeForForm);

        return {
            deletedInstantFees: [],
            deletedDelayedFees: [],
            isPartner,
            delayedFees,
            instantFees,
            enablePaymentSystem,
            ...(superDispatchSettingsPayload && { superDispatch: superDispatchSettingsPayload }),
            ...(centralDispatchPayload && { centralDispatch: centralDispatchPayload }),
            factoringEmails: factoringEmailsPayload ?? DEFAULT_FACTORING_EMAILS_SETTINGS,
        };
    }, [isError, companyFees, isPartner, enablePaymentSystem, superDispatchSettingsPayload, centralDispatchPayload, factoringEmailsPayload]);

    return { initialValues, isError };
};
