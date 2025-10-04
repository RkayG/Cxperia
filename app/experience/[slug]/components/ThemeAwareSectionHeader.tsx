

import React from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import SectionHeaderBold from './SectionHeaderBold';
import SectionHeaderLight from './SectionHeaderLight';

// Move the original SectionHeader to SectionHeaderLight for clarity
// (the file SectionHeaderLight.tsx should be created with the original code)

const headerMap: Record<string, React.FC<any>> = {
  light: SectionHeaderLight,
  bold: SectionHeaderBold,
};

const ThemeAwareSectionHeader: React.FC<any> = (props) => {
  const theme = usePublicExpStore((state) => state.theme);
  const HeaderComponent = headerMap[theme] || SectionHeaderLight;
  return <HeaderComponent {...props} />;
};

export default ThemeAwareSectionHeader;