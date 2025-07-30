'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, defaultLocale, Locale } from '@/i18n.config';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 从localStorage加载语言设置
    const savedLocale = localStorage.getItem('i18n-locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }

    // 加载翻译文件
    const loadTranslations = async () => {
      try {
        const localeToLoad = savedLocale && locales.includes(savedLocale) ? savedLocale : defaultLocale;
        const translations = await import(`@/locales/${localeToLoad}.json`);
        setTranslations(translations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    // 当语言变化时加载新的翻译文件
    const loadTranslations = async () => {
      try {
        const translations = await import(`@/locales/${locale}.json`);
        setTranslations(translations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      localStorage.setItem('i18n-locale', newLocale);
      setLocaleState(newLocale);

      // 如果路径中包含语言代码，则更新路径
      if (pathname) {
        const segments = pathname.split('/');
        if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
          const newPath = `/${newLocale}${pathname.substring(segments[1].length + 1)}`;
          router.push(newPath);
        }
      }
    }
  };

  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 如果找不到翻译，返回原始键
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}