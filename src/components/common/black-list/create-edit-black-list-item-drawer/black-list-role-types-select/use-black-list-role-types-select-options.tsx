import { useMemo } from 'react';

import { translateByNamespace } from '@utils';

const t = translateByNamespace('common:black-list-page:create-edit-drawer:fields');

export const useRoleTypesSelectOptions = () => {
    return useMemo(() => {
        const options = [
            {
                label: t('drivers-option-label'),
                value: 'drivers',
            },
            {
                label: t('dispatchers-option-label'),
                value: 'dispatchers',
            },
        ];

        return options;
    }, []);
};
