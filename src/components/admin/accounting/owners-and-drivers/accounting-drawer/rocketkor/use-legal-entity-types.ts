import { useMemo } from 'react';

import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const useLegalEntityTypes = () => {
    return useMemo(
        () => [
            { label: t('sole-proprietorship'), value: 'SP' },
            { label: t('general-partnership'), value: 'GP' },
            { label: t('limited-partnership'), value: 'LP' },
            { label: t('limited-liability-partnership'), value: 'LLP' },
            { label: t('limited-liability-limited-partnership'), value: 'LLLP' },
            { label: t('limited-liability-company'), value: 'LLC' },
            { label: t('corporation'), value: 'CORP' },
            { label: t('nonprofit'), value: 'NONPROFIT' },
            { label: t('government'), value: 'GOVERNMENT' },
        ],
        [],
    );
};
