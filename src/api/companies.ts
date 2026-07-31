import { toSnakeCase } from 'js-convert-case';

import { CompaniesFilters, CreateCompanyData, EditCompanyData, FetchedCompanies } from '@store/admin/companies/types';
import { axios } from '@utils/axios';

export const fetchCompanies = async (filters: Partial<CompaniesFilters>) => {
    const result = await axios.get('/api/companies', { params: filters });

    return result.data.data as FetchedCompanies;
};

export const createCompany = async (company: CreateCompanyData) => {
    const formData = new FormData();

    let key: keyof typeof company;

    for (key in company) {
        if (key != 'ownerAvatar') {
            formData.append(toSnakeCase(key), company[key] as string);
        }
    }

    if (company.ownerAvatar && company.ownerAvatar instanceof File) {
        formData.append('owner_avatar', company.ownerAvatar, company.ownerAvatar.name);
    }

    const result = await axios({
        url: '/api/companies',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return result.data;
};

export const editCompany = async (companyPublicId: string, data: EditCompanyData) => {
    const result = await axios({
        url: `/api/companies/${companyPublicId}`,
        method: 'PATCH',
        data: data,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return result.data;
};

export const fetchCompany = async (companyPublicId: string) => {
    const result = await axios.get(`/api/companies/${companyPublicId}`);

    return result.data.data;
};

export const deleteCompany = async (companyPublicId: string) => {
    const result = await axios.delete(`/api/companies/${companyPublicId}`);

    return result.data;
};
