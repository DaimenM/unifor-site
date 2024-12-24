'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Get the title element
      const title = document.querySelector('h1');
      if (!title) return;

      // Get the title's position
      const titleRect = title.getBoundingClientRect();
      
      // Show button when title is above viewport
      setIsVisible(titleRect.bottom < 0);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed bottom-20 right-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
} 