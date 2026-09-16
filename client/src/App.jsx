import React from 'react'
import Home from './pages/Home'
import ProductListingPage from './pages/ProductListingPage'
import { Route, Routes } from 'react-router-dom'
import ProductDetailPage from './pages/ProductDetailPage'
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      <Routes>

        {/* Home */}
        <Route
          path='/'
          element={<Home />}
        />

        {/* Sports — /products/:sport (e.g. /products/football) */}
        <Route
          path='/products/:sport'
          element={<ProductListingPage pageType="sport" />}
        />

        {/* Men — /men/:category (e.g. /men/T-Shirts) */}
        <Route
          path='/men/:category'
          element={<ProductListingPage pageType="men" />}
        />

        {/* Women — /women/:category (e.g. /women/Hoodies) */}
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

        <Route 
           path='/profile'
           element={<Profile/>}
        />

      </Routes>
    </div>
  )
}

export default App