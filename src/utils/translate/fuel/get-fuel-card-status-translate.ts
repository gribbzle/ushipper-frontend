import { toKebabCase } from 'js-convert-case';

import { FuelCardStatus } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const fuelCardStatusTranslate = translateByNamespace('admin:fuel:cards-page:statuses');

export const getFuelCardStatusTranslate = (status: FuelCardStatus): string => fuelCardStatusTranslate(toKebabCase(status));

export const getFuelCardStatusOptionTranslate = (status: FuelCardStatus): string =>
    status === FuelCardStatus.DELETED ? fuelCardStatusTranslate(`${status}-option`) : getFuelCardStatusTranslate(status);
