import React from 'react'
import NavBar from '../components/layout/NavBar'
import Hero from '../components/sections/Hero'
import TrendingProducts from '../components/sections/TrendingProducts'
import ExploreItems from '../components/sections/ExploreByItems'


function Home() {
  return (
    <div>
      <NavBar />
      <Hero />
      <TrendingProducts />
      <ExploreItems />
    </div>
  )
}

export default Home