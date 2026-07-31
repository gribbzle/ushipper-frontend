import { CarMakersFilters } from '@store/admin/car-makers-settings/types';
import { axios } from '@utils/axios';

export const fetchCarMakers = async (filters: CarMakersFilters) => {
    const result = await axios.get('/api/car-makers', { params: filters });

    return result.data.data;
};

export const createUpdateCarMaker = async (mode: 'create' | 'edit', carMaker: any) => {
    const result = await axios({
        url: mode === 'create' ? '/api/car-makers' : `/api/car-makers/${carMaker.id}`,
        method: mode === 'create' ? 'POST' : 'PATCH',
        data: carMaker,
    });

    return result.data;
};

export const fetchCarMaker = async (roleId: number) => {
    const result = await axios.get(`/api/car-makers/${roleId}`);

    return result.data.data;
};

export const deleteCarMaker = async (roleId: number) => {
    const result = await axios.delete(`/api/car-makers/${roleId}`);

    return result.data.data;
};
