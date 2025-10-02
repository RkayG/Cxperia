'use client';
import React, { useEffect, useRef, useState } from 'react';

interface SlideInSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

const getTransform = (direction: 'up' | 'left' | 'right') => {
  switch (direction) {
    case 'left':
      return 'translateX(-40px)';
    case 'right':
      return 'translateX(40px)';
    default:
      return 'translateY(40px)';
  }
};

export default function SlideInSection({ children, className = '', direction = 'up', delay = 0 }: SlideInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-none' : 'opacity-0'} ${className}`}
      style={{
        transform: visible ? 'none' : getTransform(direction),
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
