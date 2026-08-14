import React from 'react'
import Home from './pages/Home'
import ProductListingPage from './pages/ProductListingPage'
import { Route,Routes } from 'react-router-dom'

function App() {
  return (
    <div className='overflow-x-hidden' >
      <Routes>
      <Route 
        path='/'
        element={<Home />} />

      <Route 
        path='/products/:sport'
        element={<ProductListingPage />} />
      
    </Routes>


      
    </div>
  )
}

export default App