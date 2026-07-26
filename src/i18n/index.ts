import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import deCommon from './locales/de/common.json';
import en from './locales/en';

export const defaultNS = 'common';

export const resources = {
    en,
    de: {
        common: deCommon,
    },
};

i18next.use(LanguageDetector).init({
    returnObjects: true,
    fallbackLng: ['en'],
    supportedLngs: ['en', 'de'],
    debug: false,
    resources,
    defaultNS,
    detection: {
        order: ['cookie'],
        lookupQuerystring: 'lng',
        lookupCookie: 'language',
    },
});
