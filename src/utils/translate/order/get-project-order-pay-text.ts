import { translateByNamespace } from '@/utils/i18n';

import { getProjectKeyName } from '../get-project-name';

const t = translateByNamespace('client:order:payment-information:fields');

export const getProjectOrderPayText = (): string => t('project-pay', { projectName: t(getProjectKeyName()) });
