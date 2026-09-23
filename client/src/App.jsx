import React from 'react'
import Home from './pages/Home'
import ProductListingPage from './pages/ProductListingPage'
import CommunityPage from './pages/CommunityPage'
import { Route, Routes } from 'react-router-dom'
import ProductDetailPage from './pages/ProductDetailPage'
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./pages/Profile";
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from './api/axios';
import { useAuth } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { isLoading } = useAuth();

  // Lenis smooth scroll setup
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);


  // Removed duplicate session restore here because authContext handles it

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div>
      <Routes>

        {/* Home */}
        <Route
          path='/'
          element={<Home />}
        />

        {/* Community */}
        <Route 
          path='/community'
          element={<CommunityPage />}
        />

        {/* Sports — /products/:sport (e.g. /products/football) */}
        <Route
          path='/products/:sport'
          element={<ProductListingPage pageType="sport" />}
        />

        {/* Men — /men and /men/:category */}
        <Route
          path='/men'
          element={<ProductListingPage pageType="men" />}
        />
        <Route
          path='/men/:category'
          element={<ProductListingPage pageType="men" />}
        />

        {/* Women — /women and /women/:category */}
        <Route
          path='/women'
          element={<ProductListingPage pageType="women" />}
        />
        <Route
          path='/women/:category'
          element={<ProductListingPage pageType="women" />}
        />

        {/* Accessories — /accessories/:category (e.g. /accessories/Water Bottles) */}
        <Route
          path='/accessories/:category'
          element={<ProductListingPage pageType="accessories" />}
        />

        {/* Featured Collection — /featured/:subcategory (e.g. /featured/Shoes) */}
        <Route
          path='/featured/:subcategory'
          element={<ProductListingPage pageType="featured" />}
        />

        <Route 
          path='/product/:id'
          element ={<ProductDetailPage/>}
        />

        <Route 
           path='/login'
           element={<Login/>}
        />

        <Route 
           path='/signup'
           element={<Signup/>}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
             path='/profile'
             element={<Profile/>}
          />
        </Route>

      </Routes>
    </div>
  )
}

export default App