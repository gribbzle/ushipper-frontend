import { AgreementsDetailsFormState, DeletedCustomFeesData } from '../agreements-details.types';

export const transformDeletedCustomFeesValues = (values: AgreementsDetailsFormState): DeletedCustomFeesData[] => {
    const feeKeys = Object.keys(values).filter(key => key.startsWith('deleted_'));

    const transformedData = feeKeys.map(key => ({
        deletedFees: values[key],
    }));

    return transformedData;
};
