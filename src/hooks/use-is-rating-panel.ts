import { useRouter } from 'next/router';

import { getAllFiltersFromUrlParams } from '@/components/client/company/review-filters-tabs/utils';
import { ReviewTabsEnum } from '@/enums';

export const useIsRatingPanel = () => {
    const router = useRouter();
    const allUrlParams = getAllFiltersFromUrlParams(router.query);

    return allUrlParams.tabStatus === ReviewTabsEnum.RATINGS;
};
