import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';

type GenericFormType = {
    specializations?: number[];
    [key: string]: any;
};

type GenericCategory = {
    id: number;
};

export type GenericSpecialization = {
    id: number;
    categories: GenericCategory[];
};

const transportServiceTranslate = translateByNamespace('common:transport-service-types');
const transportCategoryTranslate = translateByNamespace('common:trailer-categories');

export const getTransportServiceTranslate = (specialization: string) => transportServiceTranslate(toKebabCase(specialization));

export const getTransportCategoryTranslate = (category: string): string => {
    const [amount, type] = category.split(' ');
    const count = parseInt(amount, 10);

    return transportCategoryTranslate(type, { count });
};

export const transformFormValuesToSpecializations = <T extends GenericFormType>(formValues: T): GenericSpecialization[] => {
    const { ['specializations']: specializations = [], ...otherValues } = formValues;

    return specializations.map((specializationId: number) => ({
        id: specializationId,
        ['categories']:
            otherValues[`category-${specializationId}`]?.map((categoryId: number) => ({
                id: categoryId,
            })) || [],
    }));
};
