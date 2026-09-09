import React from 'react'
import NavBar from '../components/layout/NavBar'
import Hero from '../components/sections/Hero'
import TrendingProducts from '../components/sections/TrendingProducts'
import ExploreItems from '../components/sections/ExploreByItems'
import FeaturedCollections from '../components/sections/FeaturedCollections'

function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <TrendingProducts />
      <ExploreByItems />
      <FeaturedCollections />
    </div>
  )
}

export default Home