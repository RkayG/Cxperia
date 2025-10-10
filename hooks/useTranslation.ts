'use client';

import { useState, useEffect } from 'react';
import { getTranslation, type Locale } from '@/lib/translations';

export function useTranslation(namespace: string) {
  const [locale, setLocale] = useState<Locale>('en');

  // Try to get locale from URL or default to 'en'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathLocale = window.location.pathname.split('/')[1];
      if (pathLocale === 'fr' || pathLocale === 'en') {
        setLocale(pathLocale as Locale);
      }
    }
  }, []);

  return {
    t: (key: string) => getTranslation(locale, namespace, key),
    locale,
    setLocale
  };
}
