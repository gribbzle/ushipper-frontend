import getConfig from 'next/config';

import { Load } from '@store/client';

const { publicRuntimeConfig } = getConfig();

export const getOrderProducts = (order: Load) => {
    const { dataField } = publicRuntimeConfig.productMapping;

    return order[dataField as keyof Load];
};
