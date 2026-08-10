import { translateByNamespace } from '@/utils/i18n';
import { LoadboardTab } from '@/enums/tabs/loadboard-tab';

const t = translateByNamespace('client:loadboard:filters');

export const translateLoadboardTab = (tab: LoadboardTab): string => t(tab);
