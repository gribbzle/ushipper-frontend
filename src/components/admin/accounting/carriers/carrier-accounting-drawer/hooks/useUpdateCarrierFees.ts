import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { FeeCategoryTermType } from '@/enums';
import { useHandleCreateEditCompanyFees, useHandleDeleteFees, usePublicId } from '@hooks';
import { filterValidFeeDataList } from '@utils/format-fee-for-form';
import { translateByNamespace } from '@utils/i18n';

import { CarrierAccountingDrawerFormValue, CreateDeleteFeesArgs } from '../carrier-accounting-drawer.types';
import { prepareCarrierFees } from '../utils';

const t = translateByNamespace('admin:accounting:notifications');

export const useUpdateCarrierFees = () => {
    const companyId = usePublicId();

    const handleCreateEditCompanyFees = useHandleCreateEditCompanyFees();
    const handleDeleteCompanyFees = useHandleDeleteFees();

    return useCallback(
        async ({ delayedFees, instantFees, deletedDelayedFees, deletedInstantFees }: CarrierAccountingDrawerFormValue) => {
            const createDeleteFees = ({ fees }: CreateDeleteFeesArgs) => handleCreateEditCompanyFees({ companyId, fees });

            const feeActions = [
                { fees: delayedFees, termType: FeeCategoryTermType.DELAYED, action: createDeleteFees },
                { fees: instantFees, termType: FeeCategoryTermType.INSTANT, action: createDeleteFees },
                { fees: deletedDelayedFees, action: handleDeleteCompanyFees },
                { fees: deletedInstantFees, action: handleDeleteCompanyFees },
            ];

            const feePromises = feeActions
                .filter(({ fees }) => fees?.length)
                .map(({ fees, termType, action }) => {
                    if (termType) {
                        const preparedFees = prepareCarrierFees(fees, termType);
                        const validFees = filterValidFeeDataList(preparedFees);

                        return validFees.length ? action({ fees: validFees }) : undefined;
                    }

                    return action({ deletedFees: fees });
                })
                .filter(Boolean);

            if (feePromises.length > 0) {
                try {
                    await Promise.all(feePromises);

                    toast.success<string>(t('update-fees-success'));
                } catch {
                    toast.error<string>(t('update-fees-error'));
                }
            }
        },
        [companyId, handleCreateEditCompanyFees, handleDeleteCompanyFees],
    );
};
