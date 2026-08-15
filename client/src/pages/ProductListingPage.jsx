import React from 'react'
import ProductListingHeader from '../components/ui/ProductListingHeader';
import { useParams } from 'react-router-dom';
import ProductCategoryNav from '../components/ui/ProductCategoryNav';
import ProductListCard from '../components/ui/ProductListCard';
import allProducts from "../data/allProducts"


function ProductListingPage() {
  const {sport} = useParams()

  
  return (
    <div>
       <ProductListingHeader />
       <ProductCategoryNav />
       {/* <ProductListCard product={allProducts[0]}/> */}
    </div>
  )
}

export default ProductListingPage