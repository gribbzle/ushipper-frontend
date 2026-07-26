import { translateByNamespace } from '@/utils/i18n';

import { isFreightX } from '../project-config';

const t = translateByNamespace('common:project-name');

export const getProjectKeyName = (): string => `${isFreightX ? 'freightx' : 'ushipper'}`;

export const getProjectName = (): string => t(getProjectKeyName());
