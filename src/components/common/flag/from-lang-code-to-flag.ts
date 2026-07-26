import { AmericanFlagIcon, CanadaFlagIcon, FrenchFlag, GermanyFlagIcon, RussianFlagIcon, SpanishFlagIcon } from '@icons';

export const fromLangCodeToFlag = new Map([
    ['en', AmericanFlagIcon],
    ['es', SpanishFlagIcon],
    ['ru', RussianFlagIcon],
    ['fr', FrenchFlag],
    ['de', GermanyFlagIcon],
    ['fr-ca', CanadaFlagIcon],
]);
