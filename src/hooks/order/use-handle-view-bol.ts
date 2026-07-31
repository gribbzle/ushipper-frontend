import { useCallback } from 'react';

import { fetchOrderBOL } from '@api';
import { downloadFileUsingAnchorElement } from '@utils/files';

export const useHandleViewBol = (publicId: string | null) => {
    const handleViewBolClick = useCallback(async () => {
        if (publicId) {
            const orderBol = await fetchOrderBOL(publicId);
            const { attachment } = orderBol;

            downloadFileUsingAnchorElement({ url: attachment.url, filename: attachment.name });
        }
    }, [publicId]);

    return handleViewBolClick;
};
