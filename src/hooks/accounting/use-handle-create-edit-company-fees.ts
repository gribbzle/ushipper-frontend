import { useCreateFeeMutation, usePathFeeMutation } from '@store/api/fee-api';
import { FeeData } from '@types';

export const useHandleCreateEditCompanyFees = () => {
    const [updateFee] = usePathFeeMutation();
    const [createFee] = useCreateFeeMutation();

    const handleCreateEditCompanyFees = async ({ companyId, fees = [] }: { companyId: string; fees?: FeeData[] }) => {
        if (companyId) {
            const updatedFees = fees.map(fee => ({ ...fee, companyId }));
            const promises = updatedFees.map(fee => (fee.feeId ? updateFee(fee).unwrap() : createFee(fee).unwrap()));

            try {
                await Promise.all(promises);
            } catch (error) {
                throw error;
            }
        }
    };

    return handleCreateEditCompanyFees;
};
