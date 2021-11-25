import i18n from 'i18next';
import ns1 from './ns1.json';
import { initReactI18next } from 'react-i18next';

export const resources = {
  ru: {
    ns1,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: 'ru',
  ns: ['ns1'],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});