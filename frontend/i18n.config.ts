export const defaultLocale = 'zh-CN';

export const locales = ['en', 'zh-CN', 'zh-TW', 'es'] as const;

export type Locale = (typeof locales)[number];

export const localeNames = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  es: 'Español',
};