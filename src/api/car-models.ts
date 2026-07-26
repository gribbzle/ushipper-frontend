import { CarModelsFilters } from '@store/admin';
import { axios } from '@utils';

export const fetchCarModels = async (filters: CarModelsFilters) => {
    const result = await axios.get('/api/car-models', { params: filters });

    return result.data.data;
};

export const createEditCarModel = async (mode: 'create' | 'edit', carModel: any) => {
    const result = await axios({
        url: mode === 'create' ? '/api/car-models' : `/api/car-models/${carModel.id}`,
        method: mode === 'create' ? 'POST' : 'PATCH',
        data: carModel,
    });

    return result.data;
};

export const fetchCarModel = async (roleId: number) => {
    const result = await axios.get(`/api/car-models/${roleId}`);

    return result.data.data;
};

export const deleteCarModel = async (roleId: number) => {
    const result = await axios.delete(`/api/car-models/${roleId}`);

    return result.data.data;
};

export const fetchCarModelStatuses = async () => {
    const result = await axios.get('/api/car-model-statuses');

    return result.data.data as string[];
};
