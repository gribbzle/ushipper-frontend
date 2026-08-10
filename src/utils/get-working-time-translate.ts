import { toKebabCase } from 'js-convert-case';

import { TimeCondition } from '@/enums/time-condition';
import { translateByNamespace } from '@/utils/i18n';

const workingTimeTranslate = translateByNamespace('common:working-time');

export const getWorkingTimeTranslate = (time: TimeCondition): string => workingTimeTranslate(toKebabCase(time));
