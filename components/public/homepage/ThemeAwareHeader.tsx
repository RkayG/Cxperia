import React from 'react';
import HeaderLight from './HeaderLight';
import HeaderBold from './HeaderBold';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

const headerMap: Record<string, React.FC> = {
  light: HeaderLight,
  bold: HeaderBold,
};

const ThemeAwareHeader: React.FC = () => {
  const { experience } = usePublicExpStore();
  const themeKey = experience?.data?.theme || 'light';
  const HeaderComponent = headerMap[themeKey] || HeaderLight;
  return <HeaderComponent />;
};

export default ThemeAwareHeader;
