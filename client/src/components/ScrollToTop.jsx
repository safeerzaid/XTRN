import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash (e.g., #section), do not force scroll to top
    // Also, query string changes (?page=2) do not trigger this effect because search is omitted from dependencies
    if (!hash) {
      window.scrollTo(0, 0);
      
      // Handle the admin dashboard which has its own scrollable container
      const adminScroll = document.getElementById('admin-main-scroll');
      if (adminScroll) {
        adminScroll.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
}
