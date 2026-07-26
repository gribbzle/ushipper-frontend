import { useMemo } from 'react';
import { toCamelCase } from 'js-convert-case';

import { CatalogListTabsEnum } from '@/enums';
import { TabItemBase } from '@components';
import { CatalogStatistic } from '@store/client';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:catalogs:tabs');

export const useCatalogTabValues = <S extends CatalogStatistic>(catalogStats: S) => {
    const tabs = useMemo<TabItemBase[]>(() => {
        return Object.values(CatalogListTabsEnum)
            .filter(tab => toCamelCase(tab) in catalogStats)
            .map(tab => ({
                value: tab,
                label: t(tab),
                counter: (catalogStats as any)[toCamelCase(tab)],
            }));
    }, [catalogStats]);

    return { tabs };
};
