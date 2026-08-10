import AmericanFlagIcon from '@/assets/icons/american-flag.svg';
import CanadaFlagIcon from '@/assets/icons/canada-flag.svg';
import FrenchFlag from '@/assets/icons/french-flag.svg';
import RussianFlagIcon from '@/assets/icons/russian-flag.svg';
import GermanyFlagIcon from '@/assets/icons/germany-flag.svg';
import SpanishFlagIcon from '@/assets/icons/spanish-flag.svg';

export const fromLangCodeToFlag = new Map([
    ['en', AmericanFlagIcon],
    ['es', SpanishFlagIcon],
    ['ru', RussianFlagIcon],
    ['fr', FrenchFlag],
    ['de', GermanyFlagIcon],
    ['fr-ca', CanadaFlagIcon],
]);
