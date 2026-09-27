import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  // The Community page uses its own custom CommunityNavBar
  const isCommunity = path.startsWith('/community');
  
  // Only the home page currently relies on transparent scrolling NavBar behavior.
  // Other pages (Products, Profile, Search, Cart) need a solid background.
  const isHome = path === '/';

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!isCommunity && <NavBar alwaysVisible={!isHome} />}
      
      <main className="flex-grow w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {!isCommunity && <Footer />}
    </div>
  );
};

export default Layout;
