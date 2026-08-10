import React from 'react'
import NavBar from '../components/layout/NavBar'
import Hero from '../components/sections/Hero'
import TrendingProducts from '../components/sections/TrendingProducts'
import ExploreSports from '../components/sections/ExploreSports'
import FeaturedCollections from '../components/sections/FeaturedCollections'

function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <TrendingProducts />
      <ExploreSports />
      <FeaturedCollections />
    </div>
  )
}

export default Home