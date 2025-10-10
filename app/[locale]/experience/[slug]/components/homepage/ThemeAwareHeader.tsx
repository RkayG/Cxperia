import React from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import HeaderBold from './HeaderBold';
import HeaderLight from './HeaderLight';

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
