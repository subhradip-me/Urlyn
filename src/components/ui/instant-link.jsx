'use client';

import { useOptimizedRouter } from '@/hooks/useOptimizedRouter';
import { useCallback } from 'react';

export function InstantLink({ href, children, className, ...props }) {
  const { navigateInstant, prefetchRoute } = useOptimizedRouter();

  const handleClick = useCallback((e) => {
    e.preventDefault();
    navigateInstant(href);
  }, [href, navigateInstant]);

  const handleMouseEnter = useCallback(() => {
    prefetchRoute(href);
  }, [href, prefetchRoute]);

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

export default InstantLink;
