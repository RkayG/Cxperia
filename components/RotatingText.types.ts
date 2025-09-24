import { ForwardedRef } from 'react';

export type RotatingTextProps = {
  texts: string[];
  mainClassName?: string;
  staggerFrom?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  staggerDuration?: number;
  splitLevelClassName?: string;
  transition?: any;
  rotationInterval?: number;
  animatePresenceMode?: string;
  animatePresenceInitial?: boolean;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  elementLevelClassName?: string;
};
