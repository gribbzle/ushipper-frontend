import { useDeleteFeeMutation } from '@store/api/fee-api';

export const useHandleDeleteFees = () => {
    const [deleteFee] = useDeleteFeeMutation();

    const handleDeleteFees = async ({ deletedFees = [] }: { deletedFees?: number[] }) => {
        const promises = deletedFees.map(feeId => deleteFee(feeId).unwrap());

        try {
            await Promise.all(promises);
        } catch (error) {
            throw error;
        }
    };

    return handleDeleteFees;
};
