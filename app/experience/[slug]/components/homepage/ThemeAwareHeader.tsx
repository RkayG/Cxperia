import React from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import HeaderBold from './HeaderBold';
import HeaderLight from './HeaderLight';

const headerMap: Record<string, React.FC<{ color?: string }>> = {
  light: HeaderLight,
  bold: HeaderBold,
};

interface ThemeAwareHeaderProps {
  color?: string;
}

const ThemeAwareHeader: React.FC<ThemeAwareHeaderProps> = ({ color }) => {
  const { experience } = usePublicExpStore();
  const themeKey = experience?.data?.theme || 'light';
  const HeaderComponent = headerMap[themeKey] || HeaderLight;
  return <HeaderComponent color={color} />;
};

export default ThemeAwareHeader;
