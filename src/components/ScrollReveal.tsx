'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay em milissegundos
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const getTransformStyle = () => {
    if (isVisible) return 'translate-x-0 translate-y-0 opacity-100 scale-100';

    switch (direction) {
      case 'up':
        return 'translate-y-7 opacity-0 scale-[0.98]';
      case 'down':
        return '-translate-y-7 opacity-0 scale-[0.98]';
      case 'left':
        return 'translate-x-7 opacity-0 scale-[0.98]';
      case 'right':
        return '-translate-x-7 opacity-0 scale-[0.98]';
      default:
        return 'opacity-0 scale-[0.98]';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '650ms',
      }}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransformStyle()} ${className}`}
    >
      {children}
    </div>
  );
}
