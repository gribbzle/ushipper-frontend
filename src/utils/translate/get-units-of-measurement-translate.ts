import { translateByNamespace } from '@/utils/i18n';

const unitsOfMeasurementTranslate = translateByNamespace('common:units-of-measurement');

export const getGallonsTranslate = (value: number | string) => unitsOfMeasurementTranslate('gallons', { value });

export const getPercentTranslate = (value: number | string) => unitsOfMeasurementTranslate('percent', { value });
