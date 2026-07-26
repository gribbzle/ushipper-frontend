import { translateByNamespace } from '@utils';

import { PhoneItemProps } from './phone-item.types';

const t = translateByNamespace('client:loadboard:calling');

export const fromPhoneTypeToTranslation = new Map<PhoneItemProps['type'], string>([
    ['main', t('main-phone')],
    ['local', t('local-phone')],
    ['fax', t('fax-phone')],
]);
