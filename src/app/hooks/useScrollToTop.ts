"use client";

import { useEffect } from 'react';

/**
 * Hook to scroll to top or to a specific element
 * @param trigger - Dependency that triggers the scroll
 * @param elementId - Optional element ID to scroll to (e.g., 'products')
 * @param behavior - Scroll behavior: 'auto' (instant) or 'smooth'
 */
export const useScrollToTop = (
  trigger?: any,
  elementId?: string,
  behavior: ScrollBehavior = 'smooth'
) => {
  useEffect(() => {
    if (elementId) {
      // Scroll to specific element
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior, block: 'start' });
      }
    } else {
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior });
    }
  }, [trigger, elementId, behavior]);
};

/**
 * Function to manually trigger scroll
 * @param elementId - Optional element ID to scroll to
 * @param behavior - Scroll behavior: 'auto' (instant) or 'smooth'
 */
export const scrollToTop = (elementId?: string, behavior: ScrollBehavior = 'smooth') => {
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block: 'start' });
    }
  } else {
    window.scrollTo({ top: 0, behavior });
  }
};
