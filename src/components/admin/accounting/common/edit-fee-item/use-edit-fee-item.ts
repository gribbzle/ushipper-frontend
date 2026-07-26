import { useCallback, useMemo, useState } from 'react';

import { useGetFeeCategoriesQuery } from '@store/api/fee-categories-api';

export const useEditFeeItem = () => {
    const [selectedFeeCategoryId, setSelectedFeeCategory] = useState<number | undefined>();

    const { data: feeCategories = [] } = useGetFeeCategoriesQuery();
    const selectedFeeCategory = useMemo(
        () => feeCategories?.find(feeCategory => feeCategory.id === selectedFeeCategoryId),
        [selectedFeeCategoryId, feeCategories],
    );

    const handleCategoryChange = useCallback((value: number) => setSelectedFeeCategory(value), []);

    return { handleCategoryChange, selectedFeeCategory };
};
