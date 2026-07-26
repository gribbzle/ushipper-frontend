import has from 'has-values';
import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';
import { getObjectWithoutEmptyFields } from '@/utils/objects';
import { OrderVehicle } from '@store/api/orders-api';

const vehicleTranslate = translateByNamespace('common:vehicle');
const vehiclesTypeTranslate = translateByNamespace('common:vehicle-types');

export const getFullNameOfVehicle = ({ year, make, model }: OrderVehicle): string => {
    const vehicleName = getObjectWithoutEmptyFields({
        year,
        make,
        model,
    });

    return has(vehicleName) ? Object.values(vehicleName).join(' ') : vehicleTranslate('no-data');
};

export const getVehicleTypeTranslation = ({ type }: OrderVehicle): string | null => {
    return type ? vehiclesTypeTranslate(toKebabCase(type)) : null;
};

export const getSizesOfVehicle = ({ height, length, width }: OrderVehicle) =>
    getObjectWithoutEmptyFields({
        length: length ? `${length}” L` : null,
        width: width ? `${width}” W` : null,
        height: height ? `${height}” H` : null,
    });
