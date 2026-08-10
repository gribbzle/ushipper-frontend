import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { LoadboardTab } from '@/enums/tabs/loadboard-tab';

export const useLoadboardTabSelection = () => {
    const router = useRouter();
    const { tab } = router.query;

    const activeTab = useMemo((): LoadboardTab => (tab as LoadboardTab) ?? LoadboardTab.ALL, [tab]);
    const isSavedTab = useMemo((): boolean => activeTab === LoadboardTab.SAVED, [activeTab]);
    const isAllTab = useMemo((): boolean => activeTab === LoadboardTab.ALL, [activeTab]);

    return { activeTab, isSavedTab, isAllTab };
};
