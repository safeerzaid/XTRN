import React from 'react'
import Home from './pages/Home'
import ProductListingPage from './pages/ProductListingPage'
import { Route, Routes } from 'react-router-dom'
import ProductDetailPage from './pages/ProductDetailPage'

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

        <Route 
          path='/product/:id'
          element ={<ProductDetailPage/>}
        />

      </Routes>
    </div>
  )
}

export default App