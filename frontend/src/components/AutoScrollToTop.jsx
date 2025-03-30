// This component automatically scrolls to the top when the route changes
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AutoScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null; // This component doesn't render anything
};

export default AutoScrollToTop;