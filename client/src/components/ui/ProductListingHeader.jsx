import React from 'react'
import { useParams } from 'react-router-dom'

function ProductListingHeader() {
  const {sport} = useParams()

  const formattedSports = sport.charAt(0).toUpperCase() + sport.slice(1)
  

  return (
    <header>
      <div>
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span>{formattedSports}</span>


      </div>
    </header>
  )
}

export default ProductListingHeader