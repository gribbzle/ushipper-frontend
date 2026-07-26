import { saveAs } from 'file-saver';

import { OrderBOL } from '@store/api/order-bol-api';
import { axios } from '@utils';

export const fetchOrderBOL = async (orderId: string) => {
    const result = await axios.get(`/api/orders/${orderId}/bol`);

    return result.data.data as OrderBOL;
};

export const getArchiveOfInspectionCarBodyPhotos = async (inspectionId: string) => {
    fetch(`/api/order-inspections/${inspectionId}/photos/archive`, {
        method: 'GET',
    })
        .then(res => res.blob())
        .then(blob => saveAs(blob));
};
